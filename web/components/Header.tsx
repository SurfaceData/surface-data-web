import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';

const StyledNav = styled.nav`
  align-items: center;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  text-align: center;
`;

const StyledProfile = styled.img`
  border-radius: 50%;
`;

const Header = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <StyledNav>
        <Link href="/profile" passHref>
          <a>
            <StyledProfile
                alt="Your Profile"
                src={session.user.image}
                height="32"
                width="32"
            />
          </a>
        </Link>

        <Link href="/">
          <a>
            <Image
              alt="Surface Data"
              src="/surface.svg"
              height="32"
              width="32" />
          </a>
        </Link>

        <Button
          rounded
          outline
          onClick={() => signOut({
            callbackUrl: `${window.location.origin}`,
          })}>
          Signout 
        </Button>
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

      <Button
        outline
        rounded
        onClick={() => signIn('auth0')}>
        Login / Register
      </Button>
    </StyledNav>
  )
};

export default Header;
