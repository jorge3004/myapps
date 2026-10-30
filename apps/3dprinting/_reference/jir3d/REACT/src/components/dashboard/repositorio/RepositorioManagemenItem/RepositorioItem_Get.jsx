import React from "react";
import * as HiIcons from "react-icons/hi";
import { setModal } from "../../../../store/slices/utilSlice";
import { useDispatch } from "react-redux";

export const RepositorioItem_Get = ({ repositorio }) => {
  const dispatch = useDispatch()
  const add = () => {
    dispatch(setModal({ action: "getFileFromRepositorio", item: repositorio }))
  }
  return (
    <>
      <HiIcons.HiEye
        style={{ cursor: "pointer", color: "" }}
        onClick={add}
        className="ms-3"
      />
    </>
  );
};
