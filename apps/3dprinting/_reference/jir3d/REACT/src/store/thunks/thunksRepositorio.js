import axios from "axios";
import { defaults } from "../../data/initializations";
import { setRepositorio } from "../slices/repositorioSlice";
import { getOrdenes } from "./thunksOrdenes";
import { clearModal, setModal } from "../slices/utilSlice";

const repositorioEndPoint = `${defaults.jir3dAPIs.default}/repositorio`;
const filesEndPoint = `${defaults.jir3dAPIs.default}/files`;

export const getRepositorio = () => {
  return async (dispatch, getState) => {
    const { data } = await axios(`${repositorioEndPoint}`);
    // const { data } = await axios(`${repositorioEndPoint}/${uid}`);
    dispatch(setRepositorio({ repositorio: data }))
  };
};

export const uploadFile = (body) => {
  return async (dispatch, getState) => {
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent
        let percent = Math.floor(loaded * 100 / total)
        if (percent < 100)
          dispatch(setModal({ ...modal, percent }))
      }
    }
    const { modal } = getState().util.util
    dispatch(setModal({ ...modal, loading: true }))
    const file = body.fileJir3d || body.file
    const { action, dropdownSelected } = modal

    if (file) {
      const extension = file.name.match(/\.[0-9a-z]{1,5}$/i)[0]
      if (extension !== ".gcode")
        return alert("Solo archivo gcode aceptado");
    }

    let form_data = new FormData();
    for (var key in body) {
      form_data.append(key, body[key]);
    }
    const { uid, tid, desc } = body
    const { data: data1 } = await axios.get(`${repositorioEndPoint}/${uid}/${tid}/${desc}`);

    if (data1?.length >= 1) {
      return dispatch(setModal({ ...modal, msg: `Decripción _${desc}_ya asignada`, loading: false }))
    }

    if (action === "updateFileFromRepositorio") {
      if (file) {
        await axios.put(`${repositorioEndPoint}/${dropdownSelected.rid}`, form_data, options)
      } else {
        await axios.put(`${repositorioEndPoint}/${dropdownSelected.rid}`, form_data);
      }
      dispatch(clearModal())
      dispatch(getOrdenes());
      dispatch(getRepositorio());
      return
    }
    await axios.post(`${repositorioEndPoint}/${uid}/${tid}`, form_data, options);
    dispatch(getOrdenes());
    dispatch(getRepositorio());
    dispatch(clearModal())

  };
};

export const deleteFromRepository = () => {
  return async (dispatch, getState) => {
    const { modal } = getState().util.util;
    const { rid } = modal.dropdownSelected;
    dispatch(setModal({ ...modal, loading: true }))
    const { data } = await axios.delete(`${repositorioEndPoint}/${rid}`);
    dispatch(clearModal())
    dispatch(getOrdenes());
    dispatch(getRepositorio());
  };
};

export const getFileFromRepository = () => {
  return async (dispatch, getState) => {
    const options = {
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent
        let percent = Math.floor(loaded * 100 / total)
        if (percent < 100)
          dispatch(setModal({ ...modal, percent }))
      }
    }
    const { modal } = getState().util.util;

    const { uploadPath } = modal.dropdownSelected;
    const fileName1 = uploadPath.split("/")
    const fileN = fileName1[fileName1.length - 1].split(".")[0]

    dispatch(setModal({ ...modal, loading: true }))
    const { data } = await axios.get(`${filesEndPoint}/repositorio/${fileN}`, options);
    // const { data } = await axios.get(`${repositorioEndPoint}/a/b/c/${rid}`, options);
    dispatch(setModal({ ...modal, data, loading: false }))
  };
};
