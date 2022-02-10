import type { NextPage } from 'next';
import Link from 'next/link';

import MainLayout from '../components/MainLayout';

const NewUser: NextPage = () => {
  return (
    <>
      Hi New User

      <Link href="/">
        Done
      </Link>
    </>
  );
}

NewUser.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
}

export default NewUser;
