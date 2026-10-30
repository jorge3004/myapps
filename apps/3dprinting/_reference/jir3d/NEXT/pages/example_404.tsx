// import { useAppDispatch, useAppSelector } from "@/store/store";
// import { tokenAuthentication } from "@/store/thunks/authThunk";
// import { useRouter } from "next/router";
// import { useEffect } from "react";

// export default function Custom404() {
//     const router = useRouter();
//     const dispatch = useAppDispatch();
//     const { isAuthenticated, tokens, lastAction } = useAppSelector(state => state.auth);
//     const { lastPath } = useAppSelector(state => state.user);
//     console.log(router)

//     useEffect(() => {
//         // if (lastAction === "firstRun" && tokens.status) {
//         //     dispatch(tokenAuthentication(tokens))
//         // } else if (lastAction === "firstRun" && !tokens.status) {
//         //     router.push("/login");
//         // } else if (router.asPath === lastPath) {
//         //     router.push("/dashboard");
//         // } else {
//         //     router.push(lastPath);
//         // }
//     }, [isAuthenticated]);
//     return <></>
// }
