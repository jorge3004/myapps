import axios from "axios";
import { defaults } from "../../data/initializations";
import { jir3dRoles } from "../../helpers/jir3dRoles";
import { setUser } from "../slices/userSlice";
import { setUsers } from "../slices/usersSlice";

const usersEndPoint = `${defaults.jir3dAPIs.default}/usuarios`;

export const getUsers = () => {
  return async (dispatch, getState) => {
    const user = getState().user
    const { adminFetch } = jir3dRoles(user)
    const adminCheck = adminFetch === true
    const { uid } = user;
    let { data } = await axios(usersEndPoint)
    // console.log(data)
    if (!adminCheck) {
      data.usuarios = data.usuarios.filter((element) =>
        (Number(element.createdBy) === Number(uid) || Number(element.uid) === Number(uid))
      );
    }
    dispatch(setUsers(data.usuarios));
  };
};
export const getUser = async (uid) => {
  let { data } = await axios(`${usersEndPoint}/${uid}`);
  return data
};


export const errorUser = () => {
  return async () => {
    return { error: 'Function no assigned in useGenericModalLabels.js' }
  };
};
export const addUser = (inputValues) => {
  return async (dispatch, getState) => {
    const { users } = getState().users.users;
    try {
      const { data } = await axios.post(usersEndPoint, inputValues);
      await dispatch(setUsers({ users: [...users, data] }));
      return data
    } catch (error) {
      return { error }
    }
  };
};

export const deleteUser = (uid) => {
  return async (dispatch, getState) => {
    const { users } = getState().users.users;
    await axios.delete(`${usersEndPoint}/${uid}`);
    const output = users.filter(item => item.uid !== uid)
    await dispatch(setUsers({ users: output }));
    return output
  };
};

export const editUser = (inputValues, uid) => {
  return async (dispatch, getState) => {
    // if (uid === undefined) return console.log("No UID")
    const { user } = getState()
    if (inputValues.clave === '') delete inputValues.clave
    try {
      const { data } = await axios.put(`${usersEndPoint}/${uid}`, inputValues);
      user.uid === uid &&
        dispatch(setUser(data))
      // dispatch(getUsers())
      return { data }
    } catch (error) {
      // console.log(error)
      return { error }
    }
  };
};
