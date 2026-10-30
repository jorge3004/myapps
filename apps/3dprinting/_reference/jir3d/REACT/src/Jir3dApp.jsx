import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { Provider } from 'react-redux';
import { AppRouter } from './routers/AppRouter';
import { store } from './store/store';

const clientId =
  '775523429121-veqm7fe3aqtcdp469q2upsbgi22t1s5q.apps.googleusercontent.com';
// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
//   root: {
//     // backgroundColor: 'blue',
//     // Match [md, ∞)
//     //       [900px, ∞)
//     // [theme.breakpoints.up('md')]: {
//     //   backgroundColor: 'red',
//     // },
//   },
// });

export const Jir3dApp = () => {
  return (
    <>
      {/* <ThemeProvider theme={darkTheme}> */}
      {/* <CssBaseline /> */}
      <GoogleOAuthProvider clientId={clientId}>
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </GoogleOAuthProvider>
      {/* </ThemeProvider> */}
    </>
  );
};
