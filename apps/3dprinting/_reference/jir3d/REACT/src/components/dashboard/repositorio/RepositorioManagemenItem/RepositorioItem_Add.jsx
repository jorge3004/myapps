import React from "react";
import * as AiIcons from "react-icons/ai";
import { setModal } from "../../../../store/slices/utilSlice";
import { useDispatch } from "react-redux";

export const RepositorioItem_Add = ({ repositorio }) => {
  // const newRepo = { ...repositorio, desc: "" }
  const dispatch = useDispatch()
  const add = () => {
    dispatch(setModal({ action: "uploadFileFromRepositorio", item: repositorio }))
  }
  return (
    <>
      <AiIcons.AiOutlinePlus
        style={{ cursor: "pointer", color: "green" }}
        onClick={add}
      // className="m-4"
      // aria-hidden="true"
      />
    </>
  );
};
