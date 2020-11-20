import Head from "next/head";
import { AppProps } from "next/app";
import { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);
  return (
    <>
      <Head>
        <title>I&E Statements</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Container maxWidth="sm">
        <Toolbar />
        <Typography variant="h4" gutterBottom={true}>
          Income & Expenditure Statements
        </Typography>
        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default App;
