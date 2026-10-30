import React from "react";
import { PrintIcon } from "../_Icons/PrintIcon";
import * as FiIcons from "react-icons/fi";
import { useDispatch } from "react-redux";

export const ThingGrid_AuxiliarBtns = ({ thing }) => {
  const { thumbnail, name, id, isInRepositorio } = thing;
  const dispatch = useDispatch();
  const infoClick = () => {
    const datos = {
      action: "infoModal",
      id,
      thumbnail,
      name,
      x: isInRepositorio.x,
      y: isInRepositorio.y,
      z: isInRepositorio.z,
      time: isInRepositorio.time,
      filamento: isInRepositorio.filamento,
    };
    dispatch(setModal(datos));
  };
  return (
    <div
      className={`d-flex justify-content-end w-50 m-auto`}
      style={{ height: "30px" }}
    >
      <div
        className="rounded-3 border border-light w-50 d-flex justify-content-center align-items-center"
        style={{ color: "gray", cursor: "pointer" }}
      >
        <PrintIcon item={{ tid: thing.id }} />
      </div>
      <div
        className="rounded-3 border border-light w-50"
        style={{ color: "gray", cursor: "pointer" }}
        onClick={infoClick}
      >
        <FiIcons.FiInfo />
      </div>
    </div>
  );
};
