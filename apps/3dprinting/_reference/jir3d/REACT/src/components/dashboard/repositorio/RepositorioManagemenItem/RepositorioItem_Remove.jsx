import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as FaIcons from "react-icons/fa";
import { setModal } from "../../../../store/slices/utilSlice";

export const RepositorioItem_Remove = ({ repositorio }) => {
  const { user } = useSelector((state) => state.user);
  const { uid } = repositorio;
  const dispatch = useDispatch();
  const deleteRepo = () => {
    dispatch(setModal({ action: "deleteFileFromRepositorio", item: repositorio }))

  };
  return (
    <>
      {user.uid === uid && (
        <FaIcons.FaTrash
          style={{ cursor: "pointer", color: "red" }}
          // className="me-2 me-md-4"
          // aria-hidden="true"
          onClick={deleteRepo}
        />
      )}
    </>
  );
};
