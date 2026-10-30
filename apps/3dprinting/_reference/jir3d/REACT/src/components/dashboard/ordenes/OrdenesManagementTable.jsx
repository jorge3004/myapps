import React from "react";
import { OrdenesManagementItem } from "./OrdenesManagementItem";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
export const OrdenesManagementTable = () => {
  const { user } = useSelector((state) => state.user);
  const { ordenes } = useSelector((state) => state.ordenes);
  const color = userColor(user)
  // const access =
  //   user.tipo === "admin" || user.tipo === "dev" || user.usuario === "jorge";

  return (
    <>
      <table
        className={`table table-striped tableJir3d ${color.table}`}
      >
        <thead>
          <tr>
            <th>Fecha</th>
            {/* <th>Usuario</th> */}
            <th>id</th>
            <th>título</th>
            <th>img</th>
            <th>Acciones</th>
          </tr>
        </thead>
        {ordenes.ordenes.map(
          (orden) => (
            <OrdenesManagementItem key={orden.cid} orden={orden} />
          )
          // (orden.cotizadoPor === user.usuario || access) && (
          //   <OrdenesManagementItem key={orden.id} orden={orden} />
          // )
        )}
      </table>
    </>
  );
};
