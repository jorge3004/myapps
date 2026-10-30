import React from "react";
import { CartManagementGrid } from "./CartManagementGrid";
import { CartManagementHeader } from "./CartManagementHeader";
import { CartManagementGridFooter } from "./CartManagementGridFooter";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";

export const CartManagement = React.memo(() => {
  const { user } = useSelector((state) => state.user);
  const { carrito } = useSelector((state) => state.carrito);
  const { text } = userColor(user)
  return (

    <div className={`${text} container`}    >
      <CartManagementHeader />
      {
        carrito.carrito.length !== 0 &&
        <CartManagementGrid />
      }
      <CartManagementGridFooter />
    </div>
  );
});
