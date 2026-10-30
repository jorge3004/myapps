import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { jir3dRoles } from "../../../helpers/jir3dRoles";
import { GenericIcons } from "../../utilities/GenericIcons";
export const PrinterGridHeader = ({ impresora }) => {
    const printerStatus = false
    const { user } = useSelector(state => state.user)
    const { adminFetch } = jir3dRoles(user)
    const { lan } = useSelector(state => state.user.user)

    return (
        <>
            <div className="w-25 text-center">
                <h2 className="m-auto">{lan === "MX" ? "Impresora:" : "Printer"}</h2>
                <h1
                    // className={`fw-bold m-auto ${color.text}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigator.clipboard.writeText(
                            "https://github.com/jorge3004/OctoPrint-Jir3d/archive/master.zip"
                        );
                    }}
                >
                    {impresora.nombre}
                </h1>
            </div>
            <div className="d-flex align-self-center">
                <GenericIcons
                    action="printerConfig"
                    tmp={impresora}
                />
            </div>
            {
                adminFetch && (!printerStatus || (printerStatus && (!printerStatus.printing || !printerStatus.sleeping))) &&
                <div className="ms-auto d-flex align-self-center">
                    <GenericIcons
                        action="edit"
                        tmp={impresora}
                    />
                    <GenericIcons
                        action="delete"
                        tmp={impresora}
                    />
                </div>
            }
            <GenericIcons
                action="printerSignal"
                tmp={impresora}
            />
        </>
    )
}
