import React from "react";
import { NavLink } from "react-router-dom";
import { useNavbarSidebarData } from "../../hooks/useNavbarSidebarData";
// import mainLogo from "../../assets/stl.png";

export const NavBarDashboardIcons = () => {
  const { nav } = useNavbarSidebarData();
  return (
    <div className="navbar-nav  ">
      {
        nav.map((item, index) => (
          <NavLink className="nav-link d-flex" key={index} to={item.path}>
            {item.cantidad && (
              <span className="d-flex align-items-end badge p-0">
                {item.cantidad}
              </span>
            )}
            {
              item.icon
            }
          </NavLink>
        ))
      }
    </div>
  );
};
