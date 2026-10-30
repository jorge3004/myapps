import axios from "axios";
import { defaults } from "../../data/initializations";
import { setScripts } from "../slices/scriptsSlice";

const scriptsEndPoint = `${defaults.jir3dAPIs.default}/scripts.php`;

export const getScripts = () => {
  return async (dispatch, getState) => {
    let { data } = await axios(scriptsEndPoint);
    // console.log(data);
    dispatch(setScripts(data));
    // console.log(data);
    //  if (accessJir3d) {
    //    data = data.filter(
    //      (element) =>
    //        element.createdBy === usuario || element.usuario === usuario
    //    );
    //  }
    //  dispatch(setUsers({ users: data }));
    // await dispatch(setUsuario());
    // console.log("hola");
  };
};
