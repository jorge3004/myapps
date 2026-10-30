import React from 'react'
import { useSelector } from 'react-redux';
import { userColor } from '../../../helpers/userColor';
import * as FiIcons from "react-icons/fi";

export const Upload_Thingiverse = () => {
    const { user } = useSelector((state) => state.user);
    const { text } = userColor(user)
    return (
        <>
            <button className="border rounded">
                <a
                    href={"https://accounts.thingiverse.com/login"}
                    target="_blank"
                    className={"text-dark"}
                >
                    <></> Thingiverse
                </a>
            </button>
            <br />
            <span className={text}  >
                {user.lan === "MX" ? "Correo: " : "Email: "}<></>
                <FiIcons.FiCopy
                    onClick={() =>
                        navigator.clipboard.writeText(
                            "jorgeluis.rivera01@outlook.com"
                        )
                    }
                    color="secondary"
                />
            </span>
            <br />
            <span className={text}>
                {user.lan === "MX" ? "Contraseña: " : "Password: "}<></>
                <FiIcons.FiCopy
                    onClick={() => navigator.clipboard.writeText("300jorge491")}
                    color="primary"
                />
            </span>
        </ >
    )
}
