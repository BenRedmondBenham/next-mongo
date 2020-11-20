import { GetServerSideProps } from "next";
import { getSession, Session, signIn } from "next-auth/client";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { IProfile } from "@/entity/profile";
import { getProfile } from "@/db";
import { profileProp } from "@/utils/json";

interface HomeProps {
  session: Session | null;
  profile: IProfile | null;
}

export default function Home({ session, profile }: HomeProps) {
  return (
    <div>
      {!session && (
        <>
          <Typography variant="body1" gutterBottom={true}>
            Please sign in with a Google account to use the application.
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => signIn("google")}
          >
            Sign in
          </Button>
        </>
      )}
      {session && !profile && (
        <>
          <Typography variant="body1" gutterBottom={true}>
            Welcome {session.user.name}, please complete your profile before
            submitting an I&E statement
          </Typography>
          <Link href="/profile" passHref>
            <Button color="primary" variant="outlined">
              Complete Profile
            </Button>
          </Link>
        </>
      )}
      {session && profile && (
        <>
          <Typography variant="body1" gutterBottom={true}>
            Welcome {session.user.name}, please submit an I&E statement or
            update your profile.
          </Typography>
          <Link href="/statement" passHref>
            <Button color="primary" variant="outlined">
              I&E Statement
            </Button>
          </Link>{" "}
          <Link href="/profile" passHref>
            <Button color="secondary" variant="outlined">
              Update Profile
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  req,
}) => {
  const session = (await getSession({ req })) as any;
  const loadProfile = session ? await getProfile(session.user.id) : undefined;
  const profile = profileProp(loadProfile);

  return {
    props: {
      session,
      profile,
    },
  };
};
