import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
// import { DashboardApp } from '../components/dashboard/DashboardApp';
// import { LoginApp } from "../components/login/LoginApp";
// import { userColor } from "../helpers/userColor";
import { userVerification } from '../store/thunks/thunksAuth';
import AppNavBar from '../components/Bar_MU/AppNavBar';
import SignIn from '../MUI/MUI-JIR3D/sign-in/SignIn';
import DashboardJir3d from '../MUI/MUI-JIR3D/dashboard/Dashboard';
import DashboardDefault from '../MUI/MUI-Defaults/dashboard/Dashboard';
import { logOut } from '../store/slices/authSlice';

export const AppRouter = React.memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const { auth } = useSelector((state) => state);
  // const { util } = useSelector((state) => state.util);
  // const { applyBg } = userColor(user)
  // applyBg()

  useEffect(() => {
    !!localStorage.getItem('id_token')
      ? dispatch(userVerification())
      : dispatch(logOut());
  }, []);
  const loginRoute = auth.verified ? (
    <Navigate to={'/dashboard'} />
  ) : (
    <SignIn />
  );
  // const loginRoute = user.verified ? <Navigate to={"/dashboard"} /> : <LoginApp />
  const dashboardRoute = auth.verified ? (
    user.environment === 'default' ? (
      <DashboardDefault />
    ) : (
      <DashboardJir3d />
    )
  ) : (
    <Navigate to={'/login'} />
  );
  // const dashboardRoute = user.verified ? < DashboardApp /> : <Navigate to={"/login"} />
  const otherRoute = user.verified ? (
    <Navigate to={'/dashboard'} />
  ) : (
    <Navigate to={'/login'} />
  );
  return (
    <>
      {auth.verified === undefined ? (
        <></>
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={loginRoute} />
            <Route path="/dashboard/*" element={dashboardRoute} />
            <Route path="/MUI" element={<AppNavBar />} />
            <Route path="/*" element={otherRoute} />
          </Routes>
        </Router>
      )}
    </>
  );
});
