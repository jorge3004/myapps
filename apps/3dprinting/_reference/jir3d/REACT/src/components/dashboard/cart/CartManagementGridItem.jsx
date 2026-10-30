import React from "react";
import { useSelector } from "react-redux";
import { CartItemImage } from "./CartManagementGridItem/CartItemImage";
import { CartItemTitle } from "./CartManagementGridItem/CartItemTitle";
import { CartItemActionBtns } from "./CartManagementGridItem/CartItemActionBtns";
import { CartItemPrintInfo } from "./CartManagementGridItem/CartItemPrintInfo";

export const CartManagementGridItem = ({ carrito }) => {
  const { repositorio } = useSelector((state) => state.repositorio.repositorio);

  if (!!repositorio) {
    repositorio.forEach(element => {
      if (carrito.tid === element.tid) {
        carrito.uploadPath = element.uploadPath
        carrito.uid = element.uid
      }
    });
    // console.log("object");
    // carrito = repositorio.repositorio.reduce((results, item) => {
    //   if (item.cid === carrito.cid) results = { ...item, ...results };
    //   return results;
    // }, carrito);
  }

  return (
    <tr>
      <td>
        <CartItemImage carrito={carrito} />
      </td>
      <td>
        <CartItemTitle carrito={carrito} />
      </td>
      {/* <td>
        <CartItemPrintInfo carrito={carrito} />
      </td> */}
      <td>
        <CartItemActionBtns carrito={carrito} />
      </td>
    </tr>
  );
};
