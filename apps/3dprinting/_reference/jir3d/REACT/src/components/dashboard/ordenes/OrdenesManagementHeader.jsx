import React from "react";
import { OrdenesManagementItem } from "./OrdenesManagementItem";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
export const OrdenesManagementHeader = () => {
  const { user } = useSelector((state) => state.user);
  const color = userColor(user)
  return (
    <>
      <div className="headTitleJir3d">
        <h1 className={` ${color.text}`}>
          Gestor de ordenes
        </h1>
      </div>
    </>
  );
};
