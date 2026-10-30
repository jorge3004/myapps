import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
export const RepositorioManagementHeader = () => {
  const { user } = useSelector((state) => state.user);
  const { text } = userColor(user)

  return (
    <>
      <div className="headTitleJir3d">
        <h1 className={`${text}`}>
          Gestor de repositorio
        </h1>
      </div>
    </>
  );
};
