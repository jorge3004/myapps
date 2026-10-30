import React from "react";
import { Input, Navbar } from "@nextui-org/react";
import * as FaIcons from "react-icons/fa";



export const Navbar_Input = () => {
    return (
        // <Navbar.Content>
        // <Navbar.Item>
        <Input placeholder="Buscar" clearable contentRight={<FaIcons.FaSearch fill="var(--nextui-colors-accents6)" />} aria-labelledby="searchBar" id="search" />
        // </Navbar.Item>
        // </Navbar.Content>

    );
};
