import { useDispatch } from "react-redux";
import { setScreenSize } from "../store/slices/screenSlice";

function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

export const useResizeDebounceDispatch = () => {
  const dispatch = useDispatch();
  function handleResized() {
    dispatch(setScreenSize());
  }
  const DebouncedHandleResized = debounce(handleResized, 100);
  return [DebouncedHandleResized];
};
