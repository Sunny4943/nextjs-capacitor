import '../styles/globals.css'
import 'bulma/css/bulma.min.css';
import 'bootstrap/dist/css/bootstrap.css'
import { useState } from 'react';
import { Fragment, useEffect } from "react";
import Head from "next/head";


export default function MyApp({ Component, pageProps }) {
  //export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [showChild, setShowChild] = useState(false);



  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    setShowChild(true);
  }, []);
  if (!showChild) {
    return null;
  }
 
  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <Fragment >
        <Head>
          <title>Ladder App</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
    
        
         
            <Component {...pageProps} />
        

      </Fragment>
    );
  }
} 
