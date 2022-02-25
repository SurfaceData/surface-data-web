import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import styled from 'styled-components';

import AuthenticatedHome from '@components/AuthenticatedHome';
import Header from '@components/Header';
import MainLayout from '@components/MainLayout';
import OnboardingSplash from '@components/OnboardingSplash';
import StatsSplash from '@components/StatsSplash';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const content = (
    <div>Loading</div>
  );

  if (status === "authenticated") {
    content = (
      <AuthenticatedHome />
    );
  } else if (status === "unauthenticated") {
    content = (
      <Container>
        <OnboardingSplash />
        <StatsSplash />
      </Container>
    );
  }
  return (
    <MainLayout>
      {content}
    </MainLayout>
  );
}

export default Home;
