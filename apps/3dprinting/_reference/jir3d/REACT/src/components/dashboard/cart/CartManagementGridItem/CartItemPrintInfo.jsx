import React from "react";
import { toGrams } from "../../../../data/initializations";
import { useSelector } from "react-redux";

export const CartItemPrintInfo = ({ carrito }) => {
  const { util } = useSelector((state) => state.util);
  const { grams } = carrito
  return (
    <>
      {grams ? (
        <div className="h-100 align-self-center">
          <div className={" text-center"} id="price">
            $
            {typeof util.price === "number" ? (
              <span className="fw-bolder">
                {toGrams(grams * util.price)}
              </span>
            ) : (
              <span className="text-danger">(Contacte admin)</span>
            )}
          </div>
          <div className={`text-center`} id="dimensions">
            {carrito.x}x{carrito.y}x{carrito.z}(mm)
          </div>
        </div>
      ) : (
        <div className="text-warning"> cotizando...</div>
      )}
    </>
  );
};
