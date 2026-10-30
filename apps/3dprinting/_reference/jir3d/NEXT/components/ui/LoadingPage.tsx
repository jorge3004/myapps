//Loading page with muicircularprogress
import { CircularProgress } from "@mui/material";
export const LoadingPage = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
        </div>
    )
}

