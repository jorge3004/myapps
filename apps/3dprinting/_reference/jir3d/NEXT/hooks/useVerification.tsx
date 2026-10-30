import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { tokenAuthentication } from "@/store/thunks/authThunk";
import { fetchThings } from "@/store/thunks/thingsThunk";
import { signOut, useSession } from "next-auth/react";

export const useVerification = () => {
    const { data: session, status } = useSession()
    const router = useRouter();
    const {
        tokens,
        isAuthenticated,
        lastAction
    } = useAppSelector(state => state.auth)
    const { page, categoria, lastPath } = useAppSelector(state => state.user)
    const inDashboard = router.asPath.includes("/dashboard")
    const inLogIn = router.asPath === "/login"
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true)
    // console.log(session, lastAction, status)
    useEffect(() => {
        // if ((lastAction === "firstRun" && tokens.status)) {
        //     dispatch(tokenAuthentication(tokens))
        // } else if (
        //     (lastAction === "firstRun" && !tokens.status && !inLogIn) ||
        //     (lastAction === "auth/userDeAuthenticated")
        // ) {
        //     router.push("/login");// change to /login
        // } else if (
        //     (lastAction === "formAuthentication/fullfilled" && isAuthenticated) ||
        //     (!inDashboard && isAuthenticated)
        // ) {
        //     router.push(`"/dashboard"}`); // change to /dashboard
        // }
        // !isLoading && setIsLoading(true); // change to Loading ...
    }, [lastAction]);
    useEffect(() => {
        // (
        //     (lastAction === "firstRun" && !tokens.status && inLogIn) ||
        //     (lastAction === "formAuthentication/fullfilled" && isAuthenticated && inDashboard) ||
        //     (lastAction === "tokenAuthentication/fullfilled" && !isAuthenticated && inLogIn) ||
        //     (lastAction === "tokenAuthentication/fullfilled" && isAuthenticated && inDashboard) ||
        //     (lastAction === "authError") ||
        //     (lastAction === "auth/userDeAuthenticated" && inLogIn)
        // ) && setIsLoading(false);
    }, [lastAction]);

    useEffect(() => {
        if (!tokens.status && session && status === "authenticated") {
            // console.log("Entró")
            // signOut()
        }
    }, [session]);

    useEffect(() => {
        if (
            (lastAction === "auth/userAuthenticated")
        ) {
            // dispatch(fetchThings({ page, categoria }))
        }
    }, [lastAction]);

    useEffect(() => {
        if (isAuthenticated && router.asPath !== lastPath) {
            // dispatch(editUser(lastPath))
        }
    }, [isAuthenticated]);

    return { inDashboard, isLoading, isAuthenticated }

}

