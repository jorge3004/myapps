import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../store/thunks/thunksUsers";


export const useCurrentPathTracker = () => {
    const dispatch = useDispatch();
    const { pathname: lastPath } = useLocation();
    const { user } = useSelector((state) => state.user);
    useEffect(() => {
        if (lastPath !== user.lastPath)
            dispatch(editUser({ lastPath }, user.uid));
    }, [lastPath]);


    return
}
