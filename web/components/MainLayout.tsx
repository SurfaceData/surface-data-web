import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import styled from 'styled-components';

import Header from '@components/Header';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  font-size: 12px;
`;

const MainLayout: NextPage = ({ children }) => {
  return (
    <>
      <Head>
        <title>Surface Data</title>
        <meta
          name="description"
          content="Cooperatively producing language data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {children}
      </main>

      <Footer>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
          <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" />
        </a>

        <br />

        This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.

      </Footer>
      <style jsx global>
        {`
        #__next {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        main {
          flex: 1;
        }
        `}
      </style>
    </>
  );
}

export default MainLayout;
