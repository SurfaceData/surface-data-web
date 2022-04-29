import { Trans } from "@lingui/macro";
import md5 from "md5";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Dropdown } from "rsuite";
import styled from "styled-components";

import { NextLink } from "@components/NextLink";
import { Button } from "@components/ui/Button";
import { LightBlue } from "@styles/palettes";

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

const ProfileButton = styled.button`
  background-color: transparent;
  border-radius: 50%;
`;

function getGravatarURL(email) {
  const address = String(email).trim().toLowerCase();
  const hash = md5(address);
  return `https://www.gravatar.com/avatar/${hash}`;
}

const renderProfileIcon = (props, ref) => {
  const { user, ...rest } = props;
  const image = user.image ? user.image : getGravatarURL(user.email);
  return (
    <ProfileButton {...rest} ref={ref}>
      <StyledProfile alt="Your Profile" src={image} height="32" width="32" />
    </ProfileButton>
  );
};

const Header = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <StyledNav>
        <Logo>
          <Link href="/">
            <a>
              <Image
                alt="Surface Data"
                src="/surface.svg"
                height="32"
                width="32"
              />
            </a>
          </Link>
          <span>
            | <Trans id="header-sdc">Surface Data Collective</Trans>
          </span>
        </Logo>

        <Dropdown
          placement="bottomEnd"
          title="Account"
          renderToggle={renderProfileIcon}
          user={session.user}
        >
          <Dropdown.Item style={{ width: 150 }} as={NextLink} href="/profile">
            Profile
          </Dropdown.Item>
          <Dropdown.Item
            style={{ width: 150 }}
            onSelect={() =>
              signOut({
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Logout
          </Dropdown.Item>
        </Dropdown>
      </StyledNav>
    );
  }
  return (
    <StyledNav>
      <Logo>
        <Image alt="Surface Data" src="/surface.svg" height="32" width="32" />
        <span>
          | <Trans id="header-sdc">Surface Data Collective</Trans>
        </span>
      </Logo>

      <Button rounded palette={LightBlue} onClick={() => signIn()}>
        Login / Register
      </Button>
    </StyledNav>
  );
};

export default Header;
