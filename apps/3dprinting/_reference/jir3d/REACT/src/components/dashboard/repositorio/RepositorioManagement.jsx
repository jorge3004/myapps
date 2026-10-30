import React from "react";
import { RepositorioManagementHeader } from "./RepositorioManagementHeader";
import { RepositorioManagementTable } from "./RepositorioManagementTable";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
export const RepositorioManagement = () => {
  const { repositorio } = useSelector((state) => state.repositorio);
  const { user } = useSelector((state) => state.user);
  const { text } = userColor(user)
  return (
    <>
      <div className="container  text-center ">
        <RepositorioManagementHeader />
        {repositorio.repositorio.length > 0 ? (
          <RepositorioManagementTable />
        ) : (
          <div
            className={`m-auto text-center ${text}`}
          >
            No hay artículos en repositorio
          </div>
        )}
      </div>
    </>
  );
};
