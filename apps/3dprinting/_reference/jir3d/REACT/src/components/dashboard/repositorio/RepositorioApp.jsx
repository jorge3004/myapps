import React, { useEffect } from "react";
import { RepositorioManagement } from "./RepositorioManagement";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../utilities/Loading";
import { editUser } from "../../../store/thunks/thunksUsers";
import { useLocation } from "react-router-dom";

export const RepositorioApp = () => {
  const { repositorio } = useSelector((state) => state.repositorio);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const lastPath = pathname + search;
  useEffect(() => {
    if (lastPath !== user.lastPath) {
      dispatch(editUser({ newUser: { lastPath } }, user.uid));
    }
  }, []);
  return (
    <>
      {repositorio.repositorio === undefined ? (
        <Loading msg={"Cargando Repositorio..."} />
      ) : (
        <RepositorioManagement />
      )}
    </>
  );
};
