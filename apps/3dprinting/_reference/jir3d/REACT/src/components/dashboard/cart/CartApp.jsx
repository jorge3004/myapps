import React from "react";
import { Loading } from "../../utilities/Loading";
import { useSelector } from "react-redux";
import { CartManagement } from "./CartManagement";
// import { clearUtil } from "../../../store/slices/utilSlice";

export const CartApp = () => {
  const { carrito } = useSelector((state) => state.carrito);
  return (
    <>
      {carrito.carrito === undefined ? (
        <Loading msg={""} />
      ) : (
        <CartManagement />
      )}
    </>
  );
};
