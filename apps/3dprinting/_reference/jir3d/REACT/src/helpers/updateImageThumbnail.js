import { useDispatch, useSelector } from "react-redux";
import { defaults } from "../data/initializations";
import { credentials } from "../data/credentials";
import axios from "axios";
import { useEffect } from "react";
import { editarCarrito } from "../store/thunks/thunksCarrito";

export const updateImageThumbnail = (thumbnail, tsrc, tid) => {
  // const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  let src = tsrc === undefined ? thumbnail : tsrc;
  useEffect(() => {
    if (!(tsrc?.includes("assets") || tsrc?.includes("renders"))) {
      const urlSearch = `${credentials.API_THINGIVERSE}/things/${tid}?${credentials.API_KEY_THINGIVERSE
        }&timestamp=${new Date().getTime()}`;
      const pet = async () => {
        try {
          const { data } = await axios(urlSearch);
          const infoCurso = {
            tsrc: data.thumbnail,
          };
          src = data.thumbnail;
          dispatch(editarCarrito(infoCurso, tid))
        } catch (e) {
          console.log(`Thing:${tid} no entontrado `);
        }
      };
      pet();
    }
  }, []);

  return src;
};
