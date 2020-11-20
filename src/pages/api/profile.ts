import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { createProfile } from "@/db";
import { Profile } from "@/entity/profile";

export default nextConnect().put(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = (await getSession({ req })) as any;
    if (!session) {
      res.statusCode = 401;
      return res.end();
    }

    const body = JSON.parse(req.body);

    let profileEntity = new Profile();
    profileEntity._id = session.user.id;
    profileEntity.email = session.user.email;
    profileEntity.address = body.address;
    profileEntity.dob = new Date(body.dob);
    profileEntity.phoneNumber = body.phoneNumber;

    profileEntity = await createProfile(profileEntity);
    console.log("Profile has been saved: ", profileEntity);
    res.statusCode = 201;

    res.json(profileEntity);
  }
);
