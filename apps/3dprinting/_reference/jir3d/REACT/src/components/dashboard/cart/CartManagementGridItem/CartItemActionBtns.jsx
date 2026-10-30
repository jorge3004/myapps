import React from "react";
import { useSelector } from "react-redux";
// import { CartItemActionBtns_cotiza } from "./CartItemActionBtns/CartItemActionBtns_cotiza";
import { CartItemActionBtns_delete } from "./CartItemActionBtns/CartItemActionBtns_delete";
import { PrintIcon } from "../../_Icons/PrintIcon";

export const CartItemActionBtns = ({ carrito }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <div className="d-flex justify-content-center align-items-center ">
        {/* <CartItemActionBtns_cotiza carrito={carrito} /> */}
        <CartItemActionBtns_delete carrito={carrito} />
        {
          carrito.uploadPath && user.iid && <PrintIcon item={carrito} classAtt="ms-3" />
        }
      </div>
    </>
  );
};
