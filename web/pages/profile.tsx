import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import MainLayout from '@components/MainLayout';
import { LanguageCombobox } from '@components/LanguageCombobox';
import LanguageTaskOptions from '@components/LanguageTaskOptions';
import { Button } from '@components/ui/Button';
import { Divider } from '@components/ui/Divider';
import { LabeledInput } from '@components/ui/LabeledInput';
import { SectionHeader } from '@components/ui/SectionHeader';
import type { LanguageDisplay } from '@features/language';
import type { LanguageTasks } from '@features/tasks';
import { updateUser } from '@features/userSlice';

const Container = styled.div`
  margin: 48px 24px;
`;

const InfoContainer = styled.div`
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0px;
  border: 2px solid rgba(230, 229, 227, .6);
  border-radius: 6px;
`;

const Profile: NextPage = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession({ required: true });
  const [ userLanguages, setUserLanguages ] = useState([] as LanguageTasks[]);
  const [ cldrLanguages, setCldrLanguages ] = useState([] as LanguageDisplay[]);
  useEffect(() => {
    if (status == "loading") {

    fetch('/api/languages?cldr=true')
      .then((res) => res.json())
      .then((data) => {
        setCldrLanguages(data);
      });
      return;
    }
    setUserLanguages(session.user.languages);
  }, [status, session]);

  const submit =  useCallback(() => {
    if (!session) {
      return;
    }

    const userData = session.user;
    userData.languages = userLanguages;
    dispatch(updateUser(userData));
  }, [dispatch, session, userLanguages]);

  const addLanguage = () => {
    setUserLanguages(userLanguages.concat({
      language: "",
      languageDisplay: cldrLanguages[0],
      tasks: [],
    } as LanguageTasks));
  };

  const removeLanguage = (index: number) => {
    const newLanguages = userLanguages.slice();
    newLanguages.splice(index, 1);
    setUserLanguages(newLanguages);
  }

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

        <SectionHeader>
          About You
        </SectionHeader>

        <LabeledInput 
            cldrlanguages={cldrLanguages}
            label="email"
            autoComplete="off"
            spellCheck="false"
            defaultValue={session?.user?.email}>
        </LabeledInput>

        <Divider />

        <SectionHeader>
          Languages
        </SectionHeader>

        {
          userLanguages.map( (locale, index) => (
            <InfoContainer key={locale.language}>

              <LanguageCombobox
                cldrlanguages={cldrLanguages}
                languageIndex={index}
                allLanguages={userLanguages}
                locale={locale}
                setUserLanguages={setUserLanguages}
              />

              <LanguageTaskOptions
                languageIndex={index}
                locale={locale}
                allLanguages={userLanguages}
                setUserLanguages={setUserLanguages}
              />

              <Button
                style={{width: 300}} 
                outline
                onClick={() => removeLanguage(index)}
              >
                Remove Language
              </Button>

            </InfoContainer>
          ))
        }

        <Button
            outline
            onClick={addLanguage}>
          Add Language
        </Button>

        <Divider />

        <Button rounded onClick={submit}>Save</Button>

      </Container>
    </MainLayout>
  );
}

export default Profile;

