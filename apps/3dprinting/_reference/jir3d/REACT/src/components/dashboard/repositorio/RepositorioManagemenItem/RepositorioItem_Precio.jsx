import React from "react";
import { toGrams } from "../../../../data/initializations";
import { useSelector } from "react-redux";

export const RepositorioItem_Precio = ({ repositorio }) => {
  const { grams } = repositorio;
  const { util } = useSelector((state) => state.util);
  return (
    <>
      {typeof util.price === "number" ? (
        <td>${toGrams(grams * util.price)}</td>
      ) : (
        <td className="text-danger">Contacte Admin</td>
      )}
    </>
  );
};
