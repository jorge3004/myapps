import React, { CSSProperties, FC, PropsWithChildren, ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Navbar } from "@nextui-org/react";

const style: CSSProperties = {
  color: "var(--nextui-colors-accents6)",
};
const styleActive: CSSProperties = {
  fontWeight: "bolder",
};

interface LayoutProps extends PropsWithChildren {
  text: string,
  href: string
  icon: ReactNode
}

export const ActiveLink: FC<LayoutProps> = ({ href, icon }) => {

  const { asPath } = useRouter();

  return (
    <NextLink
      href={href}
      passHref legacyBehavior
    >

      <Navbar.Link
        style={asPath === href ? styleActive : style}
        href={href}
      >

        {/* <Navbar.CollapseItem > */}
        {icon}
        {/* </Navbar.CollapseItem  > */}
      </Navbar.Link>

    </NextLink>
  );
};