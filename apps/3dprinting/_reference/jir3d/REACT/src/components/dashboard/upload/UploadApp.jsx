import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload_DropBox } from "./Upload_DropBox";
import { Upload_Jir3dEmail } from "./Upload_Jir3dEmail";
import { jir3dRoles } from "../../../helpers/jir3dRoles";
import { Upload_Thingiverse } from "./Upload_Thingiverse";

export const UploadApp = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { admin } = jir3dRoles(user)

  return (
    <>
      <div className="App text-center text-light">
        <br />
        <Upload_DropBox />
        <hr />
        {
          admin &&
          <span>
            <Upload_Jir3dEmail />
            <hr />
            <Upload_Thingiverse />
          </span>

        }
      </div>
    </>
  );
};
