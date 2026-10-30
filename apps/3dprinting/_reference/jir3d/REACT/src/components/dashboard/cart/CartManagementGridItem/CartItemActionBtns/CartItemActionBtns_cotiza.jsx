import React from "react";
import { editarCarrito } from "../../../../../store/thunks/thunksCarrito";
import { useDispatch, useSelector } from "react-redux";

export const CartItemActionBtns_cotiza = ({ carrito }) => {
  // const { dateCotiza, id } = carrito;
  // const { user } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // const cotizar = () => {
  //   let parametros = {};
  //   dateCotiza
  //     ? (parametros = {
  //         id,
  //         dateCotiza: false,
  //       })
  //     : (parametros = {
  //         id,
  //         dateCotiza: Date(),
  //         cotizadoPor: user.usuario,
  //       });
  //   dispatch(editarCarrito(parametros, true));
  // };
  return (
    <>
      {/* <div className="d-flex justify-content-center align-items-center"> */}
      {/* <CartItemActionBtns_cotiza carrito={carrito} /> */}
      <button
        className={`btn mx-3 btn-outline-success ${
          window.innerWidth < 768 ? "btn-sm" : ""
        }                      `}
      >
        {"Cotizando"}
      </button>
      {/* </div> */}
      {/* <button
        className={`btn mx-3 ${
          dateCotiza ? "btn-outline-warning" : "btn-outline-success"
        } ${window.innerWidth < 768 ? "btn-sm" : ""}                      `}
        onClick={cotizar}
      >
        {dateCotiza ? "Cotizando" : "Cotizar"}
      </button> */}
    </>
  );
};
