import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useLogin } from "@/hooks/useLogin";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { useAppSelector } from "@/store/store";
import { useMediaQuery, useTheme } from "@mui/material";
import { GoogleSignIn } from "@/components/google/GoogleSignIn";



export default function SignIn() {
    const { handleChange, handleSubmit } = useLogin();
    const { authError } = useAppSelector((state) => state.auth);
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    // console.log(isMobile)

    return (
        <BaseLayout>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            error={authError?.userName ? true : false}
                            helperText={authError?.userName ?? null}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="UserName"
                            name="userName"
                            autoComplete="email"
                            onChange={handleChange}
                            autoFocus
                        />
                        <TextField
                            error={authError?.password ? true : false}
                            helperText={authError?.password ?? null}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                        />

                        <Typography align="center" color="red">
                            {authError?.server}
                        </Typography>

                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <GoogleSignIn />
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>
            </Container>
        </BaseLayout>
    );
}