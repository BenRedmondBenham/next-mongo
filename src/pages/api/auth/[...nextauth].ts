import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      Providers.Google({
        clientId:
          "703952998005-embatqm3t4ddfpjvb570ltld80tdtice.apps.googleusercontent.com",
        clientSecret: "OWwGewg0pCWMr-E3uIJpbHXa",
      }),
    ],
    callbacks: {
      session: async (session: any, user: any) => {
        session.user.id = user.id;
        return Promise.resolve(session);
      },
      jwt: async (token, user, account, profile, isNewUser) => {
        if (account) token.id = account.id;
        return Promise.resolve(token);
      },
    },
  });
