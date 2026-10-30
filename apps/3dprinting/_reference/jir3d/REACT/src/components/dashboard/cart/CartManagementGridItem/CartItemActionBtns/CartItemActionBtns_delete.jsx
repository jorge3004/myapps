import React from "react";
import * as FaIcons from "react-icons/fa";
import { deleteCarritoCid } from "../../../../../store/thunks/thunksCarrito";
import { useDispatch } from "react-redux";

export const CartItemActionBtns_delete = ({ carrito }) => {
  const { cid } = carrito;
  const dispatch = useDispatch();
  const deleteItem = () => {
    // console.log(cid, tid);
    dispatch(deleteCarritoCid(cid));
  };
  return (
    <>
      <FaIcons.FaTrash className="text-danger m-2" onClick={deleteItem} />
    </>
  );
};
