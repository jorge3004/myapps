"use client"
import { useAppDispatch } from "@/store/store"
import { googleAuthentication } from "@/store/thunks/authThunk"
import {
    useSession, signIn, signOut
} from "next-auth/react"
import { useEffect } from "react"
import GoogleButton from 'react-google-button'

export const GoogleSignIn = () => {
    const { data: session, status } = useSession()
    const dispatch = useAppDispatch()
    useEffect(() => {
        // if (!(status === "loading") && !session) void signIn("google");
        // if (session) window.close();
    }, [session, status]);
    return (
        <GoogleButton
            onClick={(e) => {
                e.preventDefault()
                signIn("google", {
                    callbackUrl: "http://localhost:3000/dashboard",
                    redirect: false
                })
            }}
        />)
}
