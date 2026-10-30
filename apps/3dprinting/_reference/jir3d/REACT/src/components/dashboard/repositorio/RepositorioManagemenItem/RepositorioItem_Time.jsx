import React from "react";
import { secondsToHms } from "../../../../data/initializations";

export const RepositorioItem_Time = ({ repositorio }) => {
  const { time } = repositorio;

  return <td>{secondsToHms(time)}</td>;
};
