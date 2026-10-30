import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../../helpers/userColor";

export const CartItemTitle = ({ carrito }) => {
  const { ttitle, tid } = carrito;
  const { user } = useSelector((state) => state.user);
  const { screenSize } = useSelector((state) => state.screenSize);
  const color = userColor(user)


  const isPhone = screenSize.isPhoneMode;
  return (
    <div
      className={` ${color.text} h-100  d-flex justify-content-center align-self-center`}
    >
      {isPhone ? `${ttitle.slice(0, 20)} (${tid}) ` : `${ttitle}(${tid})`}
    </div>
  );
};
