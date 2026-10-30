import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { editUser } from "../store/thunks/thunksUsers";
import { getThings } from "../store/thunks/thunksThingiverse";
import { activateThingiverseWait } from "../store/slices/utilSlice";
import { paramsForThingsUpdate } from "../helpers/paramsForThingsUpdate";

export const useThingParamsUpdate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { thingiverse } = useSelector((state) => state.thingiverse);
  let dispatched = false;
  const { params, equalToUserFlag, veficationFlags } = paramsForThingsUpdate();
  console.log(params);
  console.log(equalToUserFlag);
  console.log(veficationFlags);
  useEffect(() => {
    if (equalToUserFlag.categoria && equalToUserFlag.page) {
      if (thingiverse.total === undefined) {
        dispatch(getThings({ categoria: user.categoria, page: user.page }));
      } else if (thingiverse.hits === 0 && user.page !== 1) {
      }
    } else if (equalToUserFlag.categoria) {
      if (veficationFlags.page) {
        console.log("dispatch page");
        dispatched = true;
      } else {
        console.log("page invalido");
        navigate(`?q=${params.categoria}&page=${params.page}`);
      }
    } else if (equalToUserFlag.page) {
      if (veficationFlags.categoria) {
        console.log("dispatch categoria");
        dispatched = true;
      } else {
        console.log("categoria invalida");
        navigate(`?q=${params.categoria}&page=${params.page}`);
      }
    } else {
      if (veficationFlags.categoria || veficationFlags.page) {
        console.log("dispatch dos");
        dispatched = true;
      } else {
        console.log("categoria y page invalida");
        navigate(`?q=${params.categoria}&page=${params.page}`);
      }
    }
    if (dispatched) {
      console.log("dispatched");
      dispatch(
        editUser(
          {
            newUser: { categoria: params.categoria, page: params.page },
          },
          user.usuario
        )
      );
      dispatch(getThings({ categoria: params.categoria, page: params.page }));
      dispatch(activateThingiverseWait());
    }
  }, []);
};
