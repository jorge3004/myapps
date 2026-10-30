import React, { useEffect } from "react";
import * as MdIcons from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../../../../store/slices/utilSlice";
import { updateImageThumbnail } from "../../../../helpers/updateImageThumbnail";

export const CartItemImage = React.memo(({ carrito }) => {
  const { tsrc, tid, tTitle, thumbnail } = carrito;
  const dispatch = useDispatch();
  const src = updateImageThumbnail(thumbnail, tsrc, tid);
  const modalImage = () => {
    const datos = {
      action: "image",
      tid,
      thumbnail: src,
      name: tTitle,
    };
    dispatch(setModal(datos));
  };
  return (
    <>
      <div
        className="block-icon"
        // data-bs-toggle="modal"
        // data-bs-target={`#_${id}`}
        onClick={modalImage}
      >
        <img className=" " src={src} alt={tid} />
        <MdIcons.MdZoomOutMap className="icon-tag " />
      </div>
      {/* <ImageModal id={id} thumbnail={src} name={titulo} /> */}
    </>
  );
});
