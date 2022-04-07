import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { loadTranslation } from '@common/i18n';
import MainLayout from '@components/MainLayout';
import { Button } from '@components/ui/Button';

const Container = styled.div`
  margin: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Delete: NextPage = () => {
  const router = useRouter();
  const handleDelete = () => {
    fetch('/api/delete-account')
      .then(() => {
        window.location = window.location.origin;
      });
  };

  return (
    <MainLayout>
      <Container>
        <div>
          When you delete your account, we'll remove all profile
          information from our databases but we will retain all
          contributions you've submitted up until now.  After deletion,
          we will treat those submissions as anonymous contributions and
          will not be associated with any account.
        </div>
        <div>
          <Button rounded onClick={handleDelete}>
            Delete Account
          </Button>
        </div>
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

export default Delete;
