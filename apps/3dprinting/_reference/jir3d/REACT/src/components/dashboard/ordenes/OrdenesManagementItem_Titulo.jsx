import React from "react";

export const OrdenesManagementItem_Titulo = ({ orden }) => {
  const { tlink, ttitle } = orden;
  return (
    <>
      <td>
        <a href={tlink} target="_blank">
          {ttitle.slice(0, 10)}
        </a>
      </td>
    </>
  );
};
