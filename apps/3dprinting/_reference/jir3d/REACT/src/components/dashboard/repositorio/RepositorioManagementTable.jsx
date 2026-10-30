import React from "react";
import { useSelector } from "react-redux";
import { RepositorioManagementItem } from "./RepositorioManagementItem";
import { userColor } from "../../../helpers/userColor";
export const RepositorioManagementTable = () => {
  const { user } = useSelector((state) => state.user);
  const { repositorio } = useSelector((state) => state.repositorio);
  const { table } = userColor(user)
  return (
    <>
      <table
        className={`tableJir3d table table-striped ${table}`}
      >
        <thead>
          <tr>
            <th>Id</th>
            {/* <th>Autor</th> */}
            {/* <th>Actualización</th> */}
            <th>Dim(xyz)</th>
            <th>Duración</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Actiones</th>
          </tr>
        </thead>
        <tbody>
          {repositorio.repositorio.map((repositorio) => (
            <RepositorioManagementItem
              key={repositorio.rid}
              repositorio={repositorio}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
