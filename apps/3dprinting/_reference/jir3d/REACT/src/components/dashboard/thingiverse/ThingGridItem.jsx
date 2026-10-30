import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
import { GenericIcons } from "../../utilities/GenericIcons";
import { GenericModal } from "../../utilities/GenericModal";

export const ThingGridItem = React.memo(({ thing }) => {
  const { repositorio } = useSelector((state) => state.repositorio);
  const { carrito } = useSelector((state) => state.carrito);
  const { util } = useSelector((state) => state.util);
  const { user } = useSelector((state) => state.user);
  const color = userColor(user);
  const isInRepositorio =
    !!repositorio.repositorio &&
    repositorio.repositorio.find((a) => {
      return Number(a.tid) === Number(thing.id);
    });

  let isInCarrito =
    !!carrito.carrito &&
    carrito.carrito.find((item) => Number(item.tid) === Number(thing.id));

  thing = { ...thing, isInCarrito, isInRepositorio };
  const { id, thumbnail, name } = thing;
  const [modal, setModal] = React.useState('');

  const clickImage = () => {
    setModal(true)
    console.log("first")
    // const datos = {
    //   action: "image",
    //   id,
    //   thumbnail,
    //   name,
    // };
    // dispatch(setModal(datos));
  };

  return (
    <div className="card bg-transparent border-0  animate__animated animate__fadeIn">
      <div className="card-body text-center">
        <>
          <img
            onClick={clickImage}
            src={thing.thumbnail}
            data-url={thing.public_url}
            alt="img"
            // data-bs-toggle="modal"
            // data-bs-target={`#_${thing.id}`}
            className="w-100  rounded-top border border-1"
            id="things-img-grid"
          />
          <div
            className=" border border-1 rounded-bottom d-flex mb-2"
            style={{
              height: "50px",
            }}
          >
            <p
              className={` m-auto px-1 ${color.text}`}
              id="things-titulo-img"
            >
              {thing.name}
            </p>
          </div>
        </>
        {
          <GenericIcons element="button" />
        }
        {/* {
          thing.id === Number(util.thingLoading)
            ?
            <Loading msg={""} />
            :
            <ThingGrid_LowerBtns thing={thing} />
        } */}
      </div>
      {
        modal &&
        <GenericModal setModal={setModal} action='modalImg' tmp={{ src: thumbnail, title: name }} />

      }
    </div>

  );
});
