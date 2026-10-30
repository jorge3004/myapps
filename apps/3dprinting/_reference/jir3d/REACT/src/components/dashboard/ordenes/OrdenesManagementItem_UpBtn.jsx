import React from "react";
import { uploadFile } from "../../../store/thunks/thunksRepositorio";
import { useDispatch } from "react-redux";
// import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import { } from "./OrdenesManagementItem_Image";
import { setModal } from "../../../store/slices/utilSlice";

export const OrdenesManagementItem_UpBtn = ({ orden }) => {
  const dispatch = useDispatch();
  const up = () => {
    dispatch(setModal({ action: "uploadFileFromOrdenes", item: orden }))
  }

  return (
    <td>
      <form>
        <FaIcons.FaCloudUploadAlt
          onClick={up}
          className="mx-lg-3 mx-1 b-editar" />

      </form>
    </td>
  );
};
