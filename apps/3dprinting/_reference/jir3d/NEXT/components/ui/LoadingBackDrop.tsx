import { useAppSelector } from "@/store/store"
import { Backdrop, CircularProgress } from "@mui/material"

export const LoadingBackDrop = () => {
    const user = useAppSelector(state => state.user)
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={user?.isLoading}
        // onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}