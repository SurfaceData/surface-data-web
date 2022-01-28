import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import styled from 'styled-components';

import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import OnboardingSplash from '../components/OnboardingSplash';
import StatsSplash from '../components/StatsSplash';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

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

            <button onClick={() => signOut()}>
              Sign Out
            </button>
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

        <Container>
          <OnboardingSplash />
          <StatsSplash />
        </Container>

      </main>
    </div>
  );
}

export default Home;
