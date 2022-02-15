import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import styled from 'styled-components';

import Header from '@components/Header';
import MainLayout from '@components/MainLayout';
import OnboardingSplash from '@components/OnboardingSplash';
import StatsSplash from '@components/StatsSplash';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <MainLayout>
        <div>
          Signed In View

          <button onClick={() => signOut()}>
            Sign Out
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <Container>
          <OnboardingSplash />
          <StatsSplash />
        </Container>
      </div>
    </MainLayout>
  );
}

export default Home;
