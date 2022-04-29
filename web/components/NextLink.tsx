import React from "react";
import Link from "next/link";

interface NextLinkProps {
  as: string;
  href: string;
}

export const NextLink = React.forwardRef(function NextLinkFunc(
  props: NextLinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  const { href, as, ...rest } = props;
  return (
    <Link href={href} as={as}>
      <a ref={ref} {...rest} />
    </Link>
  );
});
