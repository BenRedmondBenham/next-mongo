import { GetServerSideProps } from "next";
import { getSession, Session, signIn } from "next-auth/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import { profileProp } from "@/utils/json";
import { getProfile } from "@/db";
import { IProfile } from "@/entity/profile";

interface ProfileProps {
  session: Session;
  profile: IProfile | null;
}

export default function Profile({ session, profile }: ProfileProps) {
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm<IProfile>({
    mode: "onChange",
    defaultValues: {
      _id: (session as any).user.id ?? "",
      email: (session as any).user.email ?? "",
      ...profile,
      dob: profile ? (profile.dob as string).substring(0, 10) : "",
    },
  });
  register({ name: "_id" });
  register({ name: "email" });

  const submitHandler = async (data: IProfile) => {
    await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    router.push("/");
  };

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
      {session && (
        <>
          <Typography variant="body1" gutterBottom={true}>
            {profile ? "Update your profile." : "Complete your profile."}
          </Typography>
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl margin="normal">
              <TextField
                label="Phone Number"
                id="phoneNumber"
                name="phoneNumber"
                variant="outlined"
                autoComplete="off"
                error={errors?.phoneNumber !== undefined}
                helperText={errors?.phoneNumber?.message}
                inputRef={register({ required: true })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <br />
            <FormControl margin="normal">
              <TextField
                label="Date of Birth"
                placeholder=""
                type="date"
                id="dob"
                name="dob"
                variant="outlined"
                autoComplete="off"
                error={errors?.dob !== undefined}
                helperText={errors?.dob?.message}
                inputRef={register({ required: true })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <br />
            <FormControl margin="normal">
              <TextField
                multiline
                rows={4}
                label="Address"
                id="address"
                name="address"
                variant="outlined"
                autoComplete="off"
                error={errors?.address !== undefined}
                helperText={errors?.address?.message}
                inputRef={register({ required: true })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <br />
            <Button color="primary" variant="outlined" type="submit">
              Submit
            </Button>{" "}
            <Link href="/" passHref>
              <Button color="secondary" variant="outlined" type="submit">
                Cancel
              </Button>
            </Link>
          </form>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async ({
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
