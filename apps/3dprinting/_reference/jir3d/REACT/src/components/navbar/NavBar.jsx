import React from "react";
import { NavBardDashboardLinkLogo } from "./NavBardDashboardLinkLogo";
import { NavBardDashboardSearchBar } from "./NavBardDashboardSearchBar";
import { useSelector } from "react-redux";
import { NavBardDashboardToggleButton } from "./NavBardDashboardToggleButton";
import { NavBarDashboardUsuarioLabel } from "./NavBarDashboardUsuarioLabel";
import { useLocation } from "react-router-dom";
// import { NavBarHome } from "./NavBarHome";
import { NavBarDashboardIcons } from "./NavBarDashboardIcons";
// return () => {  ( async () => {await dispatch(resetUsers() } )()  } //Christian
export const NavBar = () => {
  const { screenSize } = useSelector((state) => state.screenSize);
  const { pathname } = useLocation();

  return (
    <div className="navbarContainer ">
      <nav
        className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top px-md-4 px-3 p-0"
        id="navBarDashboard"
      >
        {pathname === "/login" ? (
          <NavBardDashboardLinkLogo />
        ) : pathname === "/" ? (
          <>
            {/* <NavBardDashboardLinkLogo /> */}
            {/* <NavBarHome /> */}
          </>
        ) : (
          <>
            {
              screenSize.isPhoneMode ?
                <>
                  <NavBardDashboardToggleButton />
                  <NavBardDashboardLinkLogo />
                  <NavBarDashboardUsuarioLabel />
                  <NavBarDashboardIcons />
                  <NavBardDashboardSearchBar />
                </>
                :
                <>
                  <NavBardDashboardLinkLogo />
                  <NavBardDashboardSearchBar />
                  <NavBarDashboardIcons />
                  <NavBarDashboardUsuarioLabel />
                </>
            }
          </>
        )}
      </nav>
    </div>
  );
};
