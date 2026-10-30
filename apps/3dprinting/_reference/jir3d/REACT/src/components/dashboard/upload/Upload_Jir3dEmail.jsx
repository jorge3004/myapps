import React from 'react'
import { useSelector } from 'react-redux';
import { userColor } from '../../../helpers/userColor';
import * as FiIcons from "react-icons/fi";


export const Upload_Jir3dEmail = () => {
    const { user } = useSelector((state) => state.user);
    const { text } = userColor(user)

    return (
        <>
            <button className="border rounded">
                <a
                    href={"https://titan.hostgator.mx/login/"}
                    target="_blank"
                    className={"text-dark"}
                >
                    {user.lan === "MX" ? "Bandeja de correo" : "Email Inbox"}
                </a>
            </button>
            <br />
            <span className={text}>
                {user.lan === "MX" ? "Correo: " : "Email: "} <></>
                <FiIcons.FiCopy
                    onClick={() =>
                        navigator.clipboard.writeText("jir3d@jir3d.com")
                    }
                    color="secondary"
                />
            </span>
            <br />
            <span className={text}>
                {user.lan === "MX" ? "Contraseña: " : "Password: "}<></>
                <FiIcons.FiCopy
                    onClick={() => navigator.clipboard.writeText("REDACTED")}
                    color="primary"
                />
            </span>
        </ >
    )
}
