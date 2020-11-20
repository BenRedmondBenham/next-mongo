import "reflect-metadata";
import { Connection, ConnectionOptions, getConnectionManager } from "typeorm";
import { Profile } from "@/entity/profile";

const options: { [key: string]: ConnectionOptions } = {
  default: {
    type: "mongodb",
    host: process.env.DB_HOST ?? "localhost",
    database: "app-db",
    synchronize: false,
    logging: true,
    entities: [Profile],
  },
};

export const createProfile = (profile: Profile) =>
  ensureConnection().then((connection) =>
    connection.getRepository(Profile).save(profile)
  );

export const getProfile = (id: string) =>
  ensureConnection().then((connection) =>
    connection.getRepository(Profile).findOne({ _id: id })
  );

// Code below is to make database connection work with Next.JS Dev environment + HMR (Hot Module Reloading)
// https://github.com/typeorm/typeorm/issues/6241#issuecomment-643690383

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
}

async function updateConnectionEntities(
  connection: Connection,
  entities: any[]
) {
  if (!entitiesChanged(connection.options?.entities ?? [], entities)) return;

  // @ts-ignore
  connection.options.entities = entities;

  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
}

async function ensureConnection(name: string = "default"): Promise<Connection> {
  const connectionManager = getConnectionManager();

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name);

    if (!connection.isConnected) {
      await connection.connect();
    }

    if (process.env.NODE_ENV !== "production") {
      await updateConnectionEntities(connection, options[name]?.entities ?? []);
    }

    return connection;
  }

  return await connectionManager.create({ name, ...options[name] }).connect();
}
