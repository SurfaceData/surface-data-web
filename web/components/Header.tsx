import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import styled from 'styled-components';

const StyledNav = styled.nav`
  align-items: center;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  text-align: center;
`;

const SignInButton = styled.a`
  background-color: #000;
  border-radius: 6px;
  border-color: #fff;
  color: #fff;
  cursor: pointer; 
  font-size: 12px;
  padding: 6px;
`;

const StyledProfile = styled.img`
  border-radius: 50%;
`;

const Header = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <StyledNav>
        <Link href="/">
          <a>
            <Image
              alt="Surface Data"
              src="/surface.svg"
              height="32"
              width="32" />
          </a>
        </Link>

        <Link href="/profile" passHref>
          <StyledProfile
              alt="Your Profile"
              src={session.user.image}
              height="32"
              width="32"
          />
        </Link>

      </StyledNav>
    )
  }
  return (
    <StyledNav>
      <Image
        alt="Surface Data"
        src="/surface.svg"
        height="32"
        width="32"
      />

      <SignInButton
        onClick={() => signIn()}>
        Sign In
      </SignInButton>
    </StyledNav>
  )
};

export default Header;
