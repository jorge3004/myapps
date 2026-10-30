import axios from "axios";
import { defaults } from "../../data/initializations";
import { jir3dRoles } from "../../helpers/jir3dRoles";
// import { loadingOrdenes, setOrdenes } from "../slices/ordenesSlice";
import { setOrdenes } from "../slices/ordenesSlice";

const OrdenesEndPoint = `${defaults.jir3dAPIs.default}/ordenes`;
const UsuariosEndPoint = `${defaults.jir3dAPIs.default}/usuarios.php`;

export const getOrdenes = (accessJir3d = null) => {
  return async (dispatch, getState) => {
    let tipo = getState().user.user?.tipo;
    const user = getState().user.user
    const { adminFetch } = jir3dRoles(user)
    let { uid } = user;
    try {
      let { data } = await axios.get(`${OrdenesEndPoint}/${uid}`, {
        params: {
          admin: adminFetch
        }
      });
      dispatch(setOrdenes({ ordenes: data }));
      // if (accessJir3d) {
      //   const { data: usuarios } = await axios.get(UsuariosEndPoint);
      //   const usuariosFiltered = usuarios.reduce((results, user) => {
      //     if (user.usuario === usuario || user.createdBy === usuario)
      //       results.push(user.usuario);
      //     return results;
      //   }, []);
      //   data = data.filter((order) =>
      //     usuariosFiltered.includes(order.cotizadoPor)
      //   );
      // }
    } catch (e) {
      console.log("error en ordenes");
      console.log(e);
    }
  };
};
