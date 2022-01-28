import type { NextPage } from 'next';
import Link from 'next/link';

const NewUser: NextPage = () => {
  return (
    <div>
      Hi New User

      <Link href="/">
        Done
      </Link>
    </div>
  );
}

export default NewUser;
