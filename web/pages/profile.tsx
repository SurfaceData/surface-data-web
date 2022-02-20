import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import MainLayout from '@components/MainLayout';
import InputLanguageSelect from '@components/InputLanguageSelect';
import { Button } from '@components/ui/Button';
import { LabeledInput } from '@components/ui/LabeledInput';
import { updateUser } from '@features/userSlice';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Profile: NextPage = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession({ required: true });
  const [ userLanguages, setUserLanguages ] = useState<string[]>([]);
  useEffect(() => {
    if (status == "loading") {
      return;
    }

    setUserLanguages(session.user.languages);
  }, [status]);

  const submit =  useCallback(() => {
    const userData = session.user;
    userData.languages = userLanguages;
    dispatch(updateUser(userData));
  });
  const addLanguage = () => {
    setUserLanguages(userLanguages.concat(""));
  };

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
        <LabeledInput 
            label="email"
            autoComplete="off"
            spellCheck="false"
            defaultValue={session.user.email}>
        </LabeledInput>

        {
          userLanguages.map( (locale, index) => (
            <InputLanguageSelect
              key={locale}
              languageIndex={index}
              allLanguages={userLanguages}
              locale={locale}
              setUserLanguages={setUserLanguages}
            />
          ))
        }

        <Button
            outline
            onClick={addLanguage}>
          Add Language
        </Button>

        <Button onClick={submit}>Save</Button>
      </Container>
    </MainLayout>
  );
}

export default Profile;

