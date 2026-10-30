import React, { useState } from "react";
import { ModalGrudCarrito } from "../utilities/ModalGrudCarrito";

export const CartGridItemAddRemove = ({
  id,
  cantidad,
  deleteCarrito,
  editarCarrito,
}) => {
  const [eliminar, setEliminar] = useState(false);

  const handleAdd = () => {
    var items = cantidad;
    if (typeof items === "string") items = parseInt(items);

    const newCantidad = items + 1;
    const parametros = {
      id,
      cantidad: newCantidad,
    };
    editarCarrito(parametros);
  };

  const handleDelete = () => {
    var items = cantidad;
    if (typeof items === "string") items = parseInt(items);

    if (items === 1) {
      setEliminar(true);
    } else {
      const newCantidad = items - 1;
      const parametros = {
        id,
        cantidad: newCantidad,
      };
      editarCarrito(parametros);
    }
  };

  return (
    <>
      {eliminar && (
        <ModalGrudCarrito
          id={id}
          cantidad={cantidad}
          deleteCarrito={deleteCarrito}
          setEliminar={setEliminar}
        />
      )}

      <div className="d-flex btn-sm border border-1  justify-content-center rounded-3 mx-auto text-muted">
        <div className="b-secundario px-3 " onClick={handleDelete}>
          -
        </div>
        <div className=" w-25 text-uppercase ">{!!cantidad && cantidad}</div>
        <div className="b-secundario px-3 " onClick={handleAdd}>
          +
        </div>
      </div>
    </>
  );
};
