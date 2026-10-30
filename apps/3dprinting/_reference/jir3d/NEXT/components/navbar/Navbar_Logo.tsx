import React from "react";
import { Image, Navbar } from "@nextui-org/react";


export const Navbar_Logo = () => {
    return (
        <Navbar.Brand>
            <Image
                src="/assets/logo.png"
                width={80}
            />
        </Navbar.Brand>

    );
};
