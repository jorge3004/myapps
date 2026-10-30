import React from "react";

export const OrdenesManagementItem_CotPor = ({ orden }) => {
  const { cotizadoPor } = orden;
  return (
    <>
      <td>{!!cotizadoPor && cotizadoPor}</td>
    </>
  );
};
