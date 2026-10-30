import React from "react";
import { OrdenesManagementItem_Image } from "./OrdenesManagementItem_Image";
import { OrdenesManagementItem_UpBtn } from "./OrdenesManagementItem_UpBtn";
import { OrdenesManagementItem_Date } from "./OrdenesManagementItem_Date";
import { OrdenesManagementItem_CotPor } from "./OrdenesManagementItem_CotPor";
import { OrdenesManagementItem_Titulo } from "./OrdenesManagementItem_Titulo";
import { OrdenesManagementItem_Id } from "./OrdenesManagementItem_Id";

export const OrdenesManagementItem = ({ orden }) => {
  return (
    <>
      <tbody>
        <tr className="align-middle">
          <OrdenesManagementItem_Date orden={orden} />
          {/* <OrdenesManagementItem_CotPor orden={orden} /> */}
          <OrdenesManagementItem_Id orden={orden} />
          <OrdenesManagementItem_Titulo orden={orden} />
          <OrdenesManagementItem_Image orden={orden} />
          <OrdenesManagementItem_UpBtn orden={orden} />
        </tr>
      </tbody>
    </>
  );
};
