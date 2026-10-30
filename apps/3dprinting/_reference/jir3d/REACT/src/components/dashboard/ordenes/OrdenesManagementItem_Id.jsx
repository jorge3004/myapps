import React from "react";
import * as FiIcons from "react-icons/fi";
import { credentials } from "../../../data/credentials";
// import { useSelector } from "react-redux";
import axios from "axios";

export const OrdenesManagementItem_Id = ({ orden }) => {
  const { tsrc, tid, thumbnail, tlinkedit, ttitle } = orden;
  // const { user } = useSelector((state) => state.user);
  let src = tsrc === undefined ? thumbnail : tsrc;
  const cond = !(tsrc?.includes("assets") || tsrc?.includes("renders"));
  const clickDownload = (e) => {
    e.preventDefault();
    const pet = async () => {
      // const urlGet = `${carritoEndPoint}?usuario=${user.usuario}`;
      const urlSearch = `${credentials.API_THINGIVERSE}/things/${tid}?${credentials.API_KEY_THINGIVERSE
        }&timestamp=${new Date().getTime()}`;
      const { data } = await axios(urlSearch);
      window.open(data.default_image.url, "_blank");
    };
    pet();
  };
  const clickUpload = () => {
    window.open(tlinkedit, "_blank");
  };
  return (
    <>
      <td>
        <div className="d-flex justify-content-center align-items-center ">
          {tid}
          {!cond && ttitle?.includes("jir3d") && (
            <FiIcons.FiDownload onClick={clickDownload} />
          )}
          {cond && <FiIcons.FiUpload onClick={clickUpload} />}
        </div>
      </td>
    </>
  );
}
