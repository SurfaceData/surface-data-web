import { Trans } from '@lingui/macro';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { LightBlue } from '@styles/palettes';

const StyledNav = styled.nav`
  align-items: center;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  text-align: center;
`;

const Logo = styled.div`
  align-items: center;
  text-align: center;
  display: flex;
  gap: 5px;
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

        <Logo>
          <Link href="/">
            <a>
              <Image
                alt="Surface Data"
                src="/surface.svg"
                height="32"
                width="32" />
            </a>
          </Link>
          <span>| <Trans id='header-sdc'>Surface Data Collective</Trans></span>
        </Logo>

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
      <Logo>
        <Image
          alt="Surface Data"
          src="/surface.svg"
          height="32"
          width="32"
        />
        <span>| <Trans id='header-sdc'>Surface Data Collective</Trans></span>
      </Logo>

      <Button
        rounded
        palette={LightBlue}
        onClick={() => signIn()}>
        Login / Register
      </Button>
    </StyledNav>
  )
};

export default Header;
