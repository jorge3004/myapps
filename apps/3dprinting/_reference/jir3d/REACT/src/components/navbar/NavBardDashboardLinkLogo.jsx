import React from "react";
import { Link } from "react-router-dom";
import jir3dIcon from "/src/assets/images/home/logo.png";
// import jir3dIcon from "../../assets/images/home/logo.png";

export const NavBardDashboardLinkLogo = () => {
  return (
    <div className="m-auto">
      <Link to="/" className="navbar-brand">
        <img src={jir3dIcon} alt="logo-jir3d" id="jir3dLogo" />
      </Link>
    </div>
  );
};
