import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import styled from 'styled-components';

import MainLayout from '@components/MainLayout';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Input = styled.input`
  padding: 5px 12px;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  border-radius: 6px;
  outline: none;
`;


const Profile: NextPage = () => {
  const { data: session, status } = useSession({ required: true });

  if (status == "loading") {
    return (
      <MainLayout>
        <div>Loading</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <Input
            name="email"
            type="text"
            autocomplete="off"
            spellcheck="false"
            defaultValue={session.user.email}>
        </Input>
      </Container>
    </MainLayout>
  );
}

export default Profile;

