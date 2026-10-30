import React from "react";
import * as MdIcons from "react-icons/md";
// import { ImageModal } from "../../../utilities/ImageModal";
import { useDispatch } from "react-redux";
import { setModal } from "../../../../store/slices/utilSlice";
import { updateImageThumbnail } from "../../../../helpers/updateImageThumbnail";

export const RepositorioItem_Img = ({ repositorio }) => {
  const { tid, tsrc, ttitle } = repositorio;
  // const srcJir3d = updateImageThumbnail(repositorio);

  const dispatch = useDispatch();
  const modalImage = () => {
    const datos = {
      action: "image",
      id: tid,
      thumbnail: tsrc,
      name: ttitle,
    };
    dispatch(setModal(datos));
  };
  return (
    <>
      <td>
        <div
          className="block-icon"
          onClick={modalImage}
        >
          <img src={tsrc} alt="img" className="rounded" />
          <MdIcons.MdZoomOutMap className="icon-tag" />
        </div>
      </td>
      {/* <ImageModal id={id} thumbnail={srcJir3d} name={id} mode="td" /> */}
    </>
  );
};
