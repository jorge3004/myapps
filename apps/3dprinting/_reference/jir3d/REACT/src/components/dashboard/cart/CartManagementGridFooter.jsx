import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";

export const CartManagementGridFooter = () => {
  const { user } = useSelector((state) => state.user);
  const { carrito } = useSelector((state) => state.carrito);
  const { text } = userColor(user)
  // console.log(carrito.carrito.length <= 0);

  return (
    <div className={`m-auto text-center ${text}`}>
      {
        // Object.keys(carrito.carrito).length > 0
        //   ? "* Fecha estimada de entrega, dimensiones y colores disponibles después de cotización"
        //   : "No hay artículos en el carrito"
        carrito.carrito.length <= 0
          ? user.lan === "MX"
            ? "No hay artículos en el carrito"
            : "No item in cart"
          : ""
      }
    </div>
  )
}