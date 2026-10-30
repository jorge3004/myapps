import axios from "axios";
import { credentials } from "../../data/credentials";
import { thingiverse } from "../../data/initializations";
import {
  clearThings,
  loadingThings,
  setThings,
  setThingsError,
} from "../slices/thingiverseSlice";

export const getThings = (data) => {
  const { categoria, page } = data;
  return async (dispatch) => {
    await dispatch(loadingThings());
    let urlSearch = `${
      credentials.API_THINGIVERSE
    }/search/${categoria}/?page=${page}&per_page=${thingiverse.postsPerPage}&${
      credentials.API_KEY_THINGIVERSE
    }&timestamp=${new Date().getTime()}`;
    try {
      const { data: resp } = await axios(urlSearch);
      await dispatch(setThings(resp));
    } catch (e) {
      dispatch(setThingsError());
      console.log("error: " + e);
    }
  };
};
