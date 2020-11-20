import { IProfile, Profile } from "@/entity/profile";
import { classToPlain } from "class-transformer";

export const profileProp = (profile?: Profile) => {
  if (!profile) return null;
  const plainProfile = classToPlain(profile ?? null) as IProfile;
  plainProfile.dob = (plainProfile.dob as Date).toISOString();
  return plainProfile;
};
