import axios from "axios";
import { defaults } from "../../data/initializations";
import { setCarrito } from "../slices/carritoSlice";
import { clearThingLoading, thingLoading } from "../slices/utilSlice";
import { getOrdenes } from "./thunksOrdenes";

const carritoEndPoint = `${defaults.jir3dAPIs.default}/carrito`;
// const ordenesEndPoint = `${defaults.jir3dAPIs.default}/ordenes.php`;

export const getCarrito = () => {
  return async (dispatch, getState) => {
    let { uid } = getState().user.user;
    try {
      const { data } = await axios(`${carritoEndPoint}/${uid}`);
      dispatch(setCarrito({ carrito: data }));
    } catch (e) {
      console.log("error en getCarrito");
      console.log(e);
    }
  };
};
export const addCarrito = (infoCurso) => {
  const { tid, ...params } = infoCurso
  return async (dispatch, getState) => {
    dispatch(thingLoading(infoCurso.tid))
    const { uid } = getState().user.user;
    const { carrito } = getState().carrito.carrito;
    const { data } = await axios.post(`${carritoEndPoint}/${uid}/${tid}`, params);
    dispatch(setCarrito({ carrito: [...carrito, data] }));
    dispatch(clearThingLoading())
    dispatch(getOrdenes());
  };
};
export const deleteCarrito = (tid) => {
  return async (dispatch, getState) => {
    dispatch(thingLoading(tid))
    const { uid } = getState().user.user;
    const { carrito } = getState().carrito.carrito;
    const url = `${carritoEndPoint}/${uid}/${tid}`
    const { data } = await axios.delete(url);
    const newCarrito = carrito.filter(item => Number(item.tid) !== tid)
    dispatch(setCarrito({ carrito: newCarrito }));
    dispatch(clearThingLoading())
    dispatch(getOrdenes());
  };
};
export const deleteCarritoCid = (cid) => {
  return async (dispatch, getState) => {
    // dispatch(thingLoading(tid))
    const { carrito } = getState().carrito.carrito;
    const url = `${carritoEndPoint}/${cid}`
    await axios.delete(url);
    const newCarrito = carrito.filter(item => Number(item.cid) !== cid)
    dispatch(setCarrito({ carrito: newCarrito }));
    // dispatch(clearThingLoading())
    dispatch(getOrdenes());
  };
};
export const editarCarrito = (params, tid, orders = false) => {
  return async (dispatch, getState) => {
    dispatch(thingLoading(tid))
    const { carrito } = getState().carrito.carrito;
    const { uid } = getState().user.user;
    const urlGet = `${carritoEndPoint}/${uid}/${tid}`;
    try {
      const { data } = await axios.put(urlGet, params);
      // console.log(data);
      const newCarrito = carrito.filter(item => {
        return Number(item.tid) !== tid
      })
      dispatch(clearThingLoading())
      dispatch(setCarrito({ carrito: [...newCarrito, data] }));
      // console.log("editado");
      // orders && dispatch(getOrdenes());
    } catch (e) {
      console.log(e);
    }
  };
};
