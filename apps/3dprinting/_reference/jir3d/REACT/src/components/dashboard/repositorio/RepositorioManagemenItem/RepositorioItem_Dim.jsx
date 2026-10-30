import React from "react";

export const RepositorioItem_Dim = ({ repositorio }) => {
  const { x, y, z } = repositorio;
  return (
    <td>{x && y && z &&
      `${x.toFixed()} x ${y.toFixed()} x ${z.toFixed()} mm`
    }
    </td>
  );
};
