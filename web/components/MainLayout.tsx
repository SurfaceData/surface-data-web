import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import styled from 'styled-components';
import { FaDiscord } from 'react-icons/fa';
import { ImBlog, ImGithub, ImTwitter } from 'react-icons/im';

import Header from '@components/Header';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid #ccc;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  padding: 8px;
`;

const License = styled.div`
  width: 400px;
`;

const SocialIconContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialIcon = styled.a`
  align-items: center;
  border: 1px solid rgb(220, 222, 224);
  border-radius: 50%;
  color: rgb(118, 119, 122);
  display: flex;
  height: 36px;
  justify-content: center;
  opacity: 1;
  text-decoration: none;
  width: 36px;
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
        <License>
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-nc/4.0/">
            <Image
              alt="Creative Commons License"
              height={31}
              width={88}
              src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" />
          </a>
          <br />
          This work is licensed under a {' '}
          <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
            Creative Commons Attribution-NonCommercial 4.0 International License
          </a>.
        </License>

        <SocialIconContainer>
          <SocialIcon target="_blank" href="https://blog.surface-data-collective.com/">
            <ImBlog size={16} />
          </SocialIcon>

          <SocialIcon target="_blank" href="https://github.com/Surface-Data-Collective/">
            <ImGithub size={16} />
          </SocialIcon>

          <SocialIcon target="_blank" href="https://twitter.com/SurfaceData">
            <ImTwitter size={16} />
          </SocialIcon>

          <SocialIcon target="_blank" href={process.env.DISCORD_URL}>
            <FaDiscord size={16} />
          </SocialIcon>
        </SocialIconContainer>
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
