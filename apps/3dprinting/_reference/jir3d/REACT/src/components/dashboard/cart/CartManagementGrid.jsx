import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CartManagementGridItem } from "./CartManagementGridItem";
import { defaults } from "../../../data/initializations";
import axios from "axios";
import { userColor } from "../../../helpers/userColor";

export const CartManagementGrid = () => {
  const { carrito } = useSelector((state) => state.carrito);
  const { user } = useSelector((state) => state.user);
  const { table, text } = userColor(user)
  const head = user.lan === "MX" ?
    {
      Imagen: "Imagen",
      Titulo: "Título",
      Acciones: "Acciones",
    } :
    {
      Imagen: "Image",
      Titulo: "Title",
      Acciones: "Actions",
    }
  return (
    <table
      className={` table table-striped text-center tableJir3d ${table} ${text} `}
    >
      <thead>
        <tr>
          <th>{head.Imagen}</th>
          <th>{head.Titulo}</th>
          {/* <th>Estado</th> */}
          <th>{head.Acciones}</th>
        </tr>
      </thead>
      <tbody>
        {carrito.carrito.map((carrito) => (
          <CartManagementGridItem key={carrito.tid} carrito={{ ...carrito }} />
        ))}
      </tbody>
    </table>
  );
};
