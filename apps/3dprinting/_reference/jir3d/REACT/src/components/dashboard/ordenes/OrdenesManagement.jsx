import React from "react";
import { OrdenesManagementHeader } from "./OrdenesManagementHeader";
import { OrdenesManagementTable } from "./OrdenesManagementTable";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
export const OrdenesManagement = () => {
  const { ordenes } = useSelector((state) => state.ordenes);
  const { user } = useSelector((state) => state.user);
  const color = userColor(user)
  return (
    <>
      {
        <div className="container">
          <OrdenesManagementHeader />
          {ordenes.ordenes.length > 0 ? (
            <OrdenesManagementTable />
          ) : (
            <div
              className={`m-auto text-center ${color.text}`}
            >
              No hay ordenes
            </div>
          )}
        </div>
      }
    </>
  );
};
