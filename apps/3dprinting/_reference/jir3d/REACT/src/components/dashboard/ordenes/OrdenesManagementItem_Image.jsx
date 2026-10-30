import React from "react";
import * as MdIcons from "react-icons/md";
import { useDispatch } from "react-redux";
import { setModal } from "../../../store/slices/utilSlice";
import { updateImageThumbnail } from "../../../helpers/updateImageThumbnail";
export const OrdenesManagementItem_Image = React.memo(({ orden }) => {
  const dispatch = useDispatch();
  const { tsrc, tid, tTitle, thumbnail } = orden;
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
      <td>
        <div className="block-icon" onClick={modalImage}>
          <img
            className="rounded"
            alt={`${tid}`}
            src={src}
          />
          <MdIcons.MdZoomOutMap className="icon-tag " />
        </div>
      </td>
    </>
  );
});
