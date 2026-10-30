import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getImpresoras } from '../store/thunks/thunksImpresoras';
import { getThings } from '../store/thunks/thunksThingiverse';
import { getUsers } from '../store/thunks/thunksUsers';
// import { usePrinterSocket } from './usePrinterSocket';
import { useSocket } from './useSocket';
import { useCurrentPathTracker } from './useCurrentPathTracker';


export const useInitiation = () => {
  const dispatch = useDispatch();
  const { thingiverse } = useSelector((state) => state.thingiverse);
  const { user } = useSelector((state) => state.user);
  const categoria = user.categoria || ""
  const page = user.page || 1
  // usePrinterSocket()
  useCurrentPathTracker()
  useSocket()
  useEffect(() => {
    dispatch(getUsers());
    dispatch(getImpresoras());
    !!!thingiverse?.hits &&
      dispatch(getThings({ categoria, page }));
    // dispatch(getCarrito());
    // dispatch(getOrdenes());
    // dispatch(getRepositorio());
  }, []);
  return
}
