import { Column, Entity, ObjectIdColumn } from "typeorm";

export interface IProfile {
  _id: string;
  email: string;
  phoneNumber: string;
  dob: Date | string;
  address: string;
}

@Entity("profile")
export class Profile implements IProfile {
  @ObjectIdColumn()
  _id!: string;

  @Column("email")
  email!: string;

  @Column("phoneNumber")
  phoneNumber!: string;

  @Column("dob")
  dob!: Date;

  @Column("address")
  address!: string;
}
