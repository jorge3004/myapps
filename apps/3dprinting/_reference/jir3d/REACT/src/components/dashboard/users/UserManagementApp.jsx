import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
import { GenericButtons } from "../../utilities/GenericButtons";
import { Loading } from "../../utilities/Loading";
import { UserManagementTableItem } from "./UserManagementTableItem";
export const UserManagementApp = React.memo(() => {
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  const { text } = userColor(user)
  const { table } = userColor(user)
  return (
    <>
      {
        users.users === undefined
          ?
          <Loading msg={"Cargando Usuarios"} />
          :
          <div className="container">
            <div className=" headTitleJir3d">
              <h1 className={text}>{user.lan === "MX" ? "Gestor de usuarios" : "User Management"}</h1>
              {/* <GenericIcons
                action={'add'}
              /> */}
              <GenericButtons action="add" />
            </div>
            <table
              className={`table table-striped ${table} tableJir3d`}
            >
              <thead>
                <tr>
                  <th>{user.lan == "MEX" ? "Tipo" : "Role"}</th>
                  <th>{user.lan == "MEX" ? "Usuario" : "User"}</th>
                  <th>{user.lan == "MEX" ? "Impresora" : "Impresora"}</th>
                  <th>{user.lan == "MEX" ? "Acciones" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {
                  users?.users.map((usuario, index) =>
                    <UserManagementTableItem key={index} usuario={usuario} />
                  )
                }
              </tbody>
            </table>
          </div>
      }
    </>
  );
});
