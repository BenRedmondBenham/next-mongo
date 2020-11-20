import { GetServerSideProps } from "next";
import { getSession, Session, signIn } from "next-auth/client";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { IProfile } from "@/entity/profile";
import { getProfile } from "@/db";
import { profileProp } from "@/utils/json";
import { Dispatch, SetStateAction, useState } from "react";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

interface StatementProps {
  session: Session | null;
  profile: IProfile | null;
}

interface Entry {
  text: string;
  value: number;
}

export default function Statement({ session, profile }: StatementProps) {
  const [result, setResult] = useState<boolean>(false);
  const [incomes, setIcomes] = useState<Entry[]>([]);
  const [expenditures, setExpenditures] = useState<Entry[]>([]);

  const totalIncome = incomes.map((x) => x.value).reduce((a, b) => a + b, 0);
  const totalExpenditure = expenditures
    .map((x) => x.value)
    .reduce((a, b) => a + b, 0);

  const disposableIncome = totalIncome - totalExpenditure;
  const etrRatio = totalExpenditure / totalIncome;

  const grade = (() => {
    switch (Math.floor(etrRatio * 10)) {
      case 0:
        return { grade: "A", color: "#6aa74f" };
      case 1:
      case 2:
        return { grade: "B", color: "#92c47c" };
      case 3:
      case 4:
        return { grade: "C", color: "#ffd965" };
      default:
        return { grade: "D", color: "#ff9900" };
    }
  })();

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
          {result && (
            <>
              <Typography variant="body1" gutterBottom={true}>
                Thank you! Your results are below.
                <br />
                <br />
              </Typography>
              <Paper
                variant="outlined"
                style={{ padding: "25px", marginBottom: "25px" }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="h6" align="center" gutterBottom={true}>
                      I&E Rating
                    </Typography>
                    <Typography
                      variant="h1"
                      align="center"
                      gutterBottom={true}
                      style={{ color: grade.color }}
                    >
                      {grade.grade}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="h6"
                      align="center"
                      gutterBottom={true}
                      style={{ marginBottom: "25px" }}
                    >
                      Disposable Income
                    </Typography>
                    <Typography variant="h2" align="center" gutterBottom={true}>
                      £{disposableIncome}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              <Link href="/" passHref>
                <Button color="primary" variant="outlined" type="submit">
                  Home
                </Button>
              </Link>
            </>
          )}
          {!result && (
            <>
              <Typography variant="body1" gutterBottom={true}>
                Add your income and expenditure using the forms below, then
                review your statement before clicking "Calculate" to show your
                disposable income and I&E Rating.
                <br />
                <br />
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="h5">Income</Typography>
                  <Add set={setIcomes} />
                  <Sheet type="Income" entries={incomes} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5">Expenditure</Typography>
                  <Add set={setExpenditures} />
                  <Sheet type="Expenditure" entries={expenditures} />
                </Grid>
              </Grid>
              <br />
              <br />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setResult(true)}
              >
                Calculate!
              </Button>{" "}
              <Link href="/" passHref>
                <Button color="secondary" variant="outlined" type="submit">
                  Cancel
                </Button>
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Sheet({ type, entries }: { type: string; entries: Entry[] }) {
  const total = entries.map((x) => x.value).reduce((a, b) => a + b, 0);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{type}</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry: Entry) => (
            <TableRow key={entry.text}>
              <TableCell component="th" scope="row">
                {entry.text}
              </TableCell>
              <TableCell align="right">£{entry.value}</TableCell>
            </TableRow>
          ))}
          <TableRow key={"total"}>
            <TableCell component="th" scope="row">
              <strong>Total</strong>
            </TableCell>
            <TableCell align="right">
              <strong>£{total}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Add({ set }: { set: Dispatch<SetStateAction<Entry[]>> }) {
  const [text, setText] = useState<string>();
  const [value, setValue] = useState<number>(0);
  return (
    <div>
      <br />
      <TextField
        label="Text"
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="Value"
        variant="outlined"
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <br />
      <br />
      <Button
        variant="outlined"
        onClick={() => {
          if (!text || value === 0) return;
          set((x) => [...x, { text, value } as Entry]);
          setText("");
          setValue(0);
        }}
      >
        Add
      </Button>
      <br />
      <br />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<StatementProps> = async ({
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
