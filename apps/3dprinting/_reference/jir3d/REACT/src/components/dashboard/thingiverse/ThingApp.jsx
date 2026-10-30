import React from "react";
import { useSelector } from "react-redux";
import { Loading } from "../../utilities/Loading";
import { userColor } from "../../../helpers/userColor";
import { Pagination } from "./Pagination";
import { ThingGridItem } from "./ThingGridItem";

export const ThingsApp = () => {
  const { thingiverse } = useSelector((state) => state.thingiverse);
  const { user } = useSelector((state) => state.user);
  const { text } = userColor(user)
  return (
    <>
      {
        thingiverse.loading === undefined || thingiverse.loading ? (
          <Loading msg="" />
        ) : thingiverse.error ? (
          <div>
            <p
              className={`my-3 container-sm text-center  ${user.temaDark ? "text-light" : "text-dark"
                }`}
            >
              Lo sentimos, no se puedo conectar con servidor de modelos, verifique que
              tenga internet.
            </p>
          </div>
        ) : thingiverse.hits === 0 ? (
          <div>
            <p
              className={`my-3 container-sm text-center  ${text}`}
            >
              {
                user.lan === "MX" ?
                  " Lo sentimos, no se encontraron resultados de su busqueda, se recomiendarealizar la busqueda en ingles para mejores resultados."
                  : "No items found"
              }
            </p>
          </div>) : (
          <div className="container">
            <div className="row row-cols-1 row-cols-md-3">
              {
                thingiverse.hits.map((thing) => (
                  <ThingGridItem key={thing.id} thing={thing} />
                ))
              }
            </div>
            <Pagination />
          </div>
        )
      }
    </>
  );
};
