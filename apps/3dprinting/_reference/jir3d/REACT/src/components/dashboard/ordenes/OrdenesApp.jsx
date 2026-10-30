import React from "react";
import { Loading } from "../../utilities/Loading";
import { OrdenesManagement } from "./OrdenesManagement";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const OrdenesApp = () => {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const { ordenes } = useSelector((state) => state.ordenes);

  return (
    <>
      {ordenes.ordenes === undefined ? (
        <Loading msg={"Cargando ordenes..."} />
      ) : (
        <OrdenesManagement />
      )}
    </>
  );
};
