import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import { logOut } from "../../store/slices/userSlice";
import { DarkModeSwitchJir3d } from "./rightSideBar/DarkModeSwitchJir3d";
import { LanguageComponent } from "./rightSideBar/LanguageComponent";
import { userColor } from "../../helpers/userColor";

export const NavBarDashboardUsuarioLabel = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isOpen, setisOpen] = useState(false);
  const { bg, text } = userColor(user)

  return (
    <div className="navbar-nav" >
      <div
        className=" text-light m-auto d-flex nav-link"
        onClick={() => setisOpen(!isOpen)}
      >
        <span className=" text-light text-uppercase" id="usuarioLabel">
          {!!user.usuario && user.usuario.substring(0, 5)}
        </span>
        <RiIcons.RiArrowRightSLine color={"white"} className="m-auto" />
        <AiIcons.AiOutlineUser
          color={"white"}
          size={20}
          className="mx-1"
        ></AiIcons.AiOutlineUser>
      </div>
      <div
        className={`${bg} ${isOpen ? "midrop active" : "midrop"}`}
      >
        <div
          className={`${text} text-center configuraciones my-4 text-center`}
        >
          {user.lan === "MEX" ? "Configuraciones" : "Settings"}
        </div>
        <hr className="text-light"></hr>
        <DarkModeSwitchJir3d />
        <LanguageComponent />
        <div
          className={` text-center p-3 ${text}`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            dispatch(logOut())
          }}
        >
          {user.lan === "MEX" ? "Cerrar sesión" : "Log out"}
        </div>
        <div
          className={` ${isOpen ? "mibackdrop active" : "mibackdrop"}  bg-dark text-light text-center pt-5 h1`}
          onClick={() => setisOpen(!isOpen)}
        >
          x
        </div>
      </div>
    </div>
  );
};
