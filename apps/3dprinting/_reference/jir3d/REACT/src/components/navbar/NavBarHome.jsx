import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

export const NavBarHome = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login", {
      replace: true,
    });
  };
  return (
    <>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse " id="navbarNavAltMarkup">
        <div className="navbar-nav m-auto">
          <NavLink
            to="/"
            className="nav-item nav-link"
            data-toggle="collapse"
            data-target=".navbar-collapse.show"
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalago"
            href="#3"
            className="nav-item nav-link"
            data-toggle="collapse"
            data-target=".navbar-collapse.show"
          >
            Catálago
          </NavLink>
          <NavLink
            to="/nosotros"
            className="nav-item nav-link"
            data-toggle="collapse"
            data-target=".navbar-collapse.show"
          >
            Nosotros
          </NavLink>
        </div>
        <div className="navbar-nav ">
          <button
            className="btn btn-dark text-light nav-item nav-link py-1 px-3 "
            data-toggle="collapse"
            data-target=".navbar-collapse.show"
            onClick={handleLogin}
          >
            {/* Entrar */}
            <FiLogIn />
            {/* <i className="fas fa-sign-in-alt fa-2x"></i> */}
          </button>
        </div>
      </div>
    </>
  );
};
