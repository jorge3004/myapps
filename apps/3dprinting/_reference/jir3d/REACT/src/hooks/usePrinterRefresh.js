import { useEffect } from "react";
import { refreshIntervalPrinters } from "../data/initializations";
import { useDispatch, useSelector } from "react-redux";
import { getImpresoras } from "../store/thunks/thunksImpresoras";
import { setIntervalo } from "../store/slices/utilSlice";
import { editUser } from "../store/thunks/thunksUsers";

export const usePrinterRefresh = (toggled) => {
  const { util } = useSelector((state) => state.util);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  let intervalo = !!util.intervalo && util.intervalo;
  let estado = user.autosync;
  let modal = !!util.modal?.action;

  const logState = (state) => {
    dispatch(editUser({ newUser: { autosync: state } }, user.usuario));
  };
  const runInterval = () => {
    intervalo = setInterval(() => {
      dispatch(getImpresoras());
      console.log("heartbeep printer");
    }, refreshIntervalPrinters);
    dispatch(setIntervalo(intervalo));
    return intervalo;
  };
  const stopInterval = () => {
    dispatch(setIntervalo(null));
    clearInterval(intervalo);
  };

  useEffect(() => {
    if (user.tipo === "dev") {
      if (!modal && estado && !intervalo) {
        intervalo = runInterval();
      }
    }
    return () => {
      if (user.tipo === "dev") {
        if (!modal && estado && intervalo) stopInterval();
        if (modal && estado && intervalo) {
          dispatch(editUser({ newUser: { autosync: true } }, user.usuario));
        }
      }
    };
  }, [estado, modal]);

  useEffect(() => {
    if (user.tipo !== "dev" && !modal && !intervalo) {
      intervalo = runInterval();
    }
    return () => {
      if (user.tipo !== "dev" && !modal && intervalo) {
        stopInterval();
      }
    };
  }, [modal]);

  return { logState };
};
