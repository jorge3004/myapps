// import { useEffect } from "react";


// function debounce(fn, ms) {
//     let timer;
//     return () => {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             timer = null;
//             fn.apply(this, arguments);
//         }, ms);
//     };
// }

// export const useResizeDebounceDispatch = () => {
//     const dispatch = useDispatch();
//     function handleResized() {
//         dispatch(setScreenSize());
//     }
//     const DebouncedHandleResized = debounce(handleResized, 100);
//     return [DebouncedHandleResized];
// };



// const [DebouncedHandleResized] = useResizeDebounceDispatch();
// useEffect(() => {
//     window.addEventListener("resize", DebouncedHandleResized);
//     return () => {
//         window.removeEventListener("resize", DebouncedHandleResized);
//     };
// }, [DebouncedHandleResized]);
// return ({
    
// })
// }

