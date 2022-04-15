import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Sidenav, Nav, Dropdown } from 'rsuite';
import styled from 'styled-components';

import { loadTranslation } from '@common/i18n';
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
import { Red } from '@styles/palettes';

const Container = styled.div`
  flex: 2;
  margin: 48px 24px;
`;

const NavContainer = styled.div`
  width: 240px;
`;

const StyledSidenav = styled(Sidenav)`
  height: 100vh;
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

const AccountActionContainer = styled.div`
  display: flex;
  direction: column;
  justify-content: space-between;
`;

const Details = styled.details`
  border-inline-start: 2px solid #629ff4;
  margin-bottom: 2em;
  padding-inline-start: .75em;

  div {
    margin-top: 10px;
    font-size: 16px;
  }
`;

const Summary = styled.summary`
  color: #629ff4;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
`;

const Profile: NextPage = () => {
  const router = useRouter();
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
    if (userLanguages.length > 0) {
      const bcpCode = (new Intl.Locale(userLanguages[0].language)).baseName;
      document.cookie = `NEXT_LOCALE=${bcpCode}; SameSite=Lax; path=/`;
    }
    dispatch(updateUser(userData));
  }, [dispatch, session, userLanguages]);

  const addLanguage = () => {
    setUserLanguages(userLanguages.concat({
      language: "",
      languageDisplay: undefined,
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
      <NavContainer>
      <StyledSidenav>
        <Sidenav.Body>
          <Nav>
            <Nav.Item icon={<FaUserCircle />}>
              Profile
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
      </StyledSidenav>
      </NavContainer>

      <Container>
        <SectionHeader>
          About You
        </SectionHeader>

        <Details>
          <Summary>
            How this helps
          </Summary>
          <div>
            We can&apos;t govern data together without a way of
            contacting each of our members.  When we are ready to make
            larger governance decisions, we will use the email you have
            provided to reach out and start making decisions together.
          </div>
        </Details>

        <LabeledInput 
            cldrlanguages={cldrLanguages}
            label="Email"
            autoComplete="off"
            spellCheck="false"
            defaultValue={session?.user?.email}>
        </LabeledInput>

        <Divider />

        <SectionHeader>
          Languages
        </SectionHeader>

        <Details>
          <Summary>
            How to select languages?
          </Summary>
          <div> 
            We include as many languages as possible.  First, add a
            language and then search for your language by name.  For many
            languages, we use the the language&apos;s native name, such as
            日本語 instead of Japanese. In some cases we only have the
            language&apos;s name in English.
          </div>
        </Details>


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

        <AccountActionContainer >
          <Button rounded onClick={submit}>Save</Button>
          <Button
            palette={Red}
            onClick={() => router.push('/delete')}
            >
            Delete Account
          </Button>
        </AccountActionContainer>

      </Container>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadTranslation(
    ctx.locale!,
    process.env.NODE_ENV === 'production'
  );
  return {
    props: {
      translation
    }
  }
}

export default Profile;
