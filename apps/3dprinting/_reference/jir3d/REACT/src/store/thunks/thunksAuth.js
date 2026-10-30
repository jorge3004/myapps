import { defaults } from "../../data/initializations";
import { setUser } from "../slices/userSlice";
import axios from "axios";
import { editUser, getUsers } from "./thunksUsers";
import { verifyDataType, verifyDefaults } from "../../helpers/authVerHelper";
import {
  clearUtil,
  setAuthentification,
  setAuthentificationError,
  setLoading,
  setVerificationError,
} from "../slices/utilSlice";
import { headers } from "../../data/initializations";
import { logOut, setAuth } from "../slices/authSlice";

const verificationEndPoint = `${defaults.jir3dAPIs.default}/auth/verification`;
const authEndPoint = `${defaults.jir3dAPIs.default}/auth`;

export const userVerification = () => {
  return async (dispatch, getState) => {
    let { user } = getState();

    try {
      const { data } = await axios({
        method: 'post',
        url: verificationEndPoint,
        // headers,
        data: {
          id_token: localStorage.getItem("id_token"),
          refreshToken: localStorage.getItem("refreshToken")
        }
      })
      const id_token = data.verification?.id_token
      const usuario = data.usuario
      if (id_token) {
        localStorage.setItem("id_token", id_token)
      }
      if (usuario) {
        dispatch(setAuth({ verified: true }))
        if (Object.keys(user).length === 0) dispatch(setUser(usuario))
        dispatch(getUsers())
      } else {
        dispatch(logOut())
      }
      // console.log(data);
    } catch (e) {
      console.log("verification");
      console.log(e);
      dispatch(logOut())
    }
  };
};
export const userAuthentication = (credentials) => {
  return async (dispatch) => {
    try {
      // return console.log(credentials)
      // dispatch(setLoading(true))
      const { data } = await axios({
        method: 'post',
        url: authEndPoint,
        data: credentials,
        // headers
      });
      localStorage.setItem("id_token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      dispatch(setAuth({ verified: true }))
      dispatch(setUser(data.usuario))
    }
    catch (e) {
      console.log(e.response);
      const msg = (e.response === undefined) ?
        "Contact Administrator(0)" :
        e.response.status === 400 ?
          e.response.data.msg :
          `Contact Administrator(${e.response.status})`
      dispatch(setAuth({ error: msg }))
      dispatch(setLoading(false))
    }
  }

}
