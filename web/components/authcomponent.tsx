import { useSession, signIn, signOut } from 'next-auth/react';

const AuthButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email}

        <br />

        <button onClick={() => signOut()}>
          Sign Out
        </button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn()}>
        Sign In
      </button>
    </>
  );
};

export default AuthButton;
