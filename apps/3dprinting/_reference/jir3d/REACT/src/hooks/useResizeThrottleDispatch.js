import { useDispatch } from "react-redux";
import { setScreenSize } from "../store/slices/screenSlice";

function throttle(fn, ms) {
  let flag = true;
  return () => {
    if (flag) {
      fn.apply(this, arguments);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, ms);
    }
  };
}

export const useResizeThrottleDispatch = () => {
  const dispatch = useDispatch();
  function handleResized() {
    dispatch(setScreenSize());
  }
  const throttledHandleResized = throttle(handleResized, 250);
  return [throttledHandleResized];
};
