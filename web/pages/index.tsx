import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import OnboardingSplash from '../components/OnboardingSplash';

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <Head>
          <title>Surface Data</title>
          <meta
            name="description"
            content="Cooperatively producing language data" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Header />

          <div>
            Signed In View
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Surface Data</title>
        <meta
          name="description"
          content="Cooperatively producing language data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <OnboardingSplash />
      </main>
    </div>
  );
}

export default Home;
