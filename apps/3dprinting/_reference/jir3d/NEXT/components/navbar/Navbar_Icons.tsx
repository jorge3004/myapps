import React, { ReactNode, useEffect, useState } from "react";
import * as VscIcons from "react-icons/vsc";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi";
import * as ImIcons from "react-icons/im";
import * as TbIcons from "react-icons/tb";
import { Navbar } from "@nextui-org/react";
import { ActiveLink } from "./ActiveLink";
import { useRouter } from "next/router";

const size = 20

const navbar_icons: {
    text: string, href: string, icon: ReactNode
}[] = [
        {
            text: "Uploads",
            href: "/uploads",
            icon: <ImIcons.ImUpload size={size} />,
        },
        {
            text: "Adm Usuarios",
            href: "/users",
            icon: <FiIcons.FiUsers size={size} />,
        },
        {
            text: "Printers",
            href: "/printers",
            icon: <BsIcons.BsPrinter size={size} />,
        },
        {
            text: "Repository",
            href: "/repository",
            icon: <VscIcons.VscFileSubmodule size={size} />,
        },
        {
            text: "Orders",
            href: "/orders",
            icon: <MdIcons.MdOutlineDriveFolderUpload size={size} />,
        },

        {
            text: "Test",
            href: "/test",
            icon: <TbIcons.TbTestPipe size={size} />,
        },
    ];

const cartIcon: {
    text: string, href: string, icon: ReactNode
} = {
    text: "Cart",
    href: "/cart",
    icon: <BsIcons.BsCart size={size} />,
}

export const Navbar_Icons = () => {
    const [enable, setEnable] = useState(false)
    useEffect(() => {
        setEnable(true)
    }, [])
    return (
        <>
            {
                enable &&
                <>
                    <Navbar.Content   >
                        <ActiveLink text={cartIcon.text} href={cartIcon.href} icon={cartIcon.icon} />
                        {/* {
                            navbar_icons.map(({ text, href, icon }) => (
                                <ActiveLink text={text} href={href} icon={icon} key={href}
                                />
                            ))
                        } */}
                        <Navbar.Collapse  >
                        </Navbar.Collapse>
                    </Navbar.Content>
                </>
            }
        </>
    )
}