
import axios from "axios";
import {
  defaults,
  // headers
} from "../../data/initializations";
// import { infoToOctoData } from "../../helpers/infoToOctoData";
import { clearImpresoras, setImpresoras } from "../slices/impresorasSlice";
import { clearOperation, clearModal, updateModal } from "../slices/utilSlice";
import { jir3dRoles } from "../../helpers/jir3dRoles";

const impresorasEndPoint = `${defaults.jir3dAPIs.default}/impresoras`;

export const getImpresoras = (accessJir3d = null) => {
  return async (dispatch, getState) => {
    const user = getState().user?.user;
    const { adminFetch } = jir3dRoles(user)
    let impresoras = []
    if (adminFetch) {
      let { data } = await axios(impresorasEndPoint);
      impresoras = data
    } else if (user.iid) {
      let { data } = await axios(`${impresorasEndPoint}/${user.iid}`);
      impresoras = [data]
    }
    dispatch(setImpresoras({ impresoras }));
  };
};
export const getImpresora = async (iid) => {
  const { data } = await axios(`${impresorasEndPoint}/${iid}`);
  return data
};
export const addImpresora = (inputValues) => {
  return async (dispatch, getState) => {
    const { impresoras } = getState().impresoras.impresoras;
    try {
      const { data } = await axios.post(impresorasEndPoint, inputValues);
      const printers = { impresoras: [...impresoras, data] }
      dispatch(setImpresoras(printers));
      return inputValues
    } catch (error) {
      return { error }
    }
  };
};
export const removeImpresora = (impresora) => {
  return async (dispatch, getState) => {
    const { impresoras } = getState().impresoras.impresoras
    try {
      const { data } = await axios.delete(`${impresorasEndPoint}/${impresora.iid}`);
      const printers = impresoras.filter(item => {
        return item.iid !== data.impresora.iid
      })
      dispatch(setImpresoras({ impresoras: printers }));
      return printers
    }
    catch (error) {
      return { error }
    }
  };
};
export const editarImpresora = (inputForm, iid) => {
  return async (dispatch, getState) => {
    const { impresoras } = getState().impresoras.impresoras
    // const { isActive, price, lastAction } = inputValues
    try {
      const { data } = await axios.put(`${impresorasEndPoint}/${iid}`, inputForm)
      const printers = impresoras.filter(item => item.iid !== data.iid)
      const newPrinters = [data, ...printers]
      dispatch(setImpresoras({ impresoras: newPrinters }));
      // isActive === undefined && price === undefined && lastAction !== undefined && await dispatch(clearModal())
      return data
    } catch (error) {
      return { error }
    }
  };
};
