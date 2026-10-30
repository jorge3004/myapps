import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPrice } from "../store/slices/utilSlice";
import { getImpresora } from "../store/thunks/thunksImpresoras";
import { getUser } from "../store/thunks/thunksUsers";

export const useSetPrice = () => {
  const { impresoras } = useSelector((state) => state.impresoras.impresoras);
  const { util } = useSelector((state) => state.util);
  const { iid, createdBy } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [price, setPriceLocal] = useState(Number(util.price))

  useEffect(() => {
    if (!!impresoras) {
      if (iid) {
        impresoras.forEach(element => {
          const { price: localPrice, iid: localIid } = element
          if (localIid === iid) {
            if (localPrice)
              setPriceLocal(Number(localPrice));
            else
              setPriceLocal("(Contacte Admin)");
          }
        })
      }
      else
        setPriceLocal("(Contacte Admin)");
    }
  }, [impresoras]);

  useEffect(() => {
    const getData = async (uid) => {
      const { iid } = await getUser(uid)
      const { price: res } = await getImpresora(iid)
      return res
    }
    const main = async () => {
      if (price) {
        if (price === "(Contacte Admin)" && createdBy) {
          const localP = await getData(createdBy)
          if (localP)
            return await dispatch(setPrice(Number(localP)));
        }
        await dispatch(setPrice(Number(price)));
      }
    }
    main()
  }, [price])

  return price;
};