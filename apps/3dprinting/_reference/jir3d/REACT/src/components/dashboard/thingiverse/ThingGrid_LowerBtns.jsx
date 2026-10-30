import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
import { ThingGrid_AuxiliarBtns } from "./ThingGrid_AuxiliarBtns";

export const ThingGrid_LowerBtns = ({ thing }) => {
  const { user } = useSelector((state) => state.user);
  const color = userColor(user);
  const { id: tid, isInCarrito, isInRepositorio, public_url, thumbnail, name } = thing;
  const condition = isInRepositorio;
  const { util } = useSelector((state) => state.util);

  const handleAdd = () => {
    dispatch(editarCarrito({ cantidad: Number(isInCarrito.cantidad) + 1 }, thing.id));
  };
  const handleDelete = () => {
    if (Number(isInCarrito.cantidad) === 1) {
      dispatch(deleteCarrito(tid));
    } else
      dispatch(editarCarrito({ cantidad: Number(isInCarrito.cantidad) - 1 }, tid));
  };
  const handleClick = ({ target }) => {
    const infoCurso = {
      tid: target.getAttribute("data-tid"),
      ttitle: target.getAttribute("data-title"),
      tlink: target.getAttribute("data-url"),
      tsrc: target.getAttribute("data-src"),
      cantidad: 1,
      query: `/dashboard/busqueda?q=${user.categoria}&page=${user.page + 1}`,
      // fecha: new Date(),
      // dateCotiza: Date(),
    };
    dispatch(addCarrito(infoCurso));
  };

  return (
    <div className="d-flex">
      <div
        disabled={true}
        className={`d-flex justify-content-center rounded-3 border border-light bg-transparent ${condition ? "w-50" : "w-100"
          }`}
        style={{ fontSize: "10px", height: "30px" }}
      >
        {
          Number(isInCarrito?.cantidad) > 0 ?
            <>
              <h4
                className="m-auto text-muted  w-100"
                style={{ cursor: "pointer" }}
                onClick={handleDelete}
              >
                -
              </h4>
              <p
                className={`w-25 my-auto ${color.text}`}
              >
                {isInCarrito?.cantidad}
              </p>
              <h4
                style={{ cursor: "pointer" }}
                className="m-auto text-muted  w-100"
                onClick={handleAdd}
              >
                +
              </h4>
            </>
            :
            <button
              onClick={handleClick}
              style={{ cursor: "pointer" }}
              className={`text-uppercase align-self-center w-100 bg-transparent border border-0 ${color.text}`}
              data-title={name}
              data-tid={tid}
              data-url={public_url}
              data-src={thumbnail}
              disabled={util.thingLoading}
            >
              {user.lan === "MX" ? "Agregar Al Carrito" : "Add to Cart"}
            </button>
        }
      </div>
      {
        condition && <ThingGrid_AuxiliarBtns thing={thing} />
      }
    </div>
  );
};
