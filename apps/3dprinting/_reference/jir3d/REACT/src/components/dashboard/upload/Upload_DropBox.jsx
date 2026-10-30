import axios from "axios";
import React from 'react'
import DropboxChooser from "react-dropbox-chooser";
import { useDispatch, useSelector } from 'react-redux';
import { addCarrito } from "../../../store/thunks/thunksCarrito";
import { userColor } from "../../../helpers/userColor";
import * as FiIcons from "react-icons/fi";


const APP_KEY = "pt1la775qs0el2z";
// const access_token =
//   "sl.BWJvutKGkRcsP14RDOf78vIN52SoxSXFjfSrav0FUi-3vIYmU5iJ7iu7dwEtYQ-fJXt7k7QJTNBaOmRRYs1I4W_OgnymRqoXVNqfvP2vTOAJRV_iRN4rNiJGWFPMAydJSOXT0SA";

export const Upload_DropBox = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { text } = userColor(user)


    const handleSuccess = async (files) => {
        // setUrl(files[0].thumbnailLink);
        const newName = files[0].name.slice(0, -4);
        const { data } = await axios.post(
            "https://api.thingiverse.com/things/?access_token=REDACTED_THINGIVERSE_TOKEN",
            {
                name: `${newName}(jir3d)`,
                category: "Games",
                license: "cc",
                tags: ["foo", "bar", "baz"],
                description: `${user.usuario}01`,
            }
        );
        const infoCurso = {
            tid: data.id,
            ttitle: data.name,
            tlinkedit: `${data.public_url}/edit`,
            thumbnail: data.thumbnail,
            cantidad: 1,
            query: `/dashboard/busqueda?q=${user.categoria}&page=${user.page + 1}`,
            cotizadoPor: user.usuario,
            tlink: `https://www.thingiverse.com/thing:${data.id}`,
            files_url: data.files_url,
            jir3d: true,
        };
        // const { data: data2 } = await axios.post(
        //   `https://api.thingiverse.com/things/${data.id}/files/?access_token=REDACTED_THINGIVERSE_TOKEN `,
        //   {
        //     filename: data.name,
        //   }
        // );

        dispatch(addCarrito(infoCurso));
    };
    return (
        <>
            <div className="container text-center">
                <DropboxChooser
                    className="text-center border rounded"
                    appKey={APP_KEY}
                    success={handleSuccess}
                    cancel={() => console.log("closed")}
                    multiselect={false}
                >

                </DropboxChooser>
            </div>
            <span className={text}>
                {user.lan === "MX" ? "Correo:" : "Email: "} <></>
                <FiIcons.FiCopy
                    onClick={() => navigator.clipboard.writeText("jir3d@jir3d.com")}
                    color="secondary"
                />
            </span>
            <br />
            <span className={text}>
                {user.lan === "MX" ? " Contraseña: " : "Password: "} <></>
                <FiIcons.FiCopy
                    onClick={() => navigator.clipboard.writeText("REDACTED")}
                    color="primary"
                />
            </span>
        </>
    )
}
