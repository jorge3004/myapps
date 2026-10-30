import React from "react";
import * as AiIcons from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { Modal } from "reactstrap";
import { useNavbarSidebarData } from "../../hooks/useNavbarSidebarData";

export const SideBar = ({ sidebar, setSidebar }) => {
  const { side } = useNavbarSidebarData();
  return (
    <>
      <Modal
        modalClassName="modal-right h-100"
        isOpen={sidebar}
        modalTransition={{ timeout: 0 }}
        backdropTransition={{ timeout: 0 }}
      >
        <nav className={"bg-dark  sidebar-nav-menu"}>
          <div className="text-light bg-black bg-gradient h3 ps-4 hding">
            <div className="pt-4">Operaciones</div>
            <div className="pb-4">JIR3D</div>
          </div>
          {side.map((item, index) => {
            return (
              <NavLink
                key={index}
                className="navbar-nav nav-link nav-text d-block"
                onClick={() => setSidebar(false)}
                to={item.path}
              >
                {item.icon}
                <span className="ps-2">{item.title}</span>
              </NavLink>
            );
          })}
          <div
            className="sidebarClose text-light text-center h1"
            onClick={() => setSidebar(false)}
          >
            <AiIcons.AiOutlineClose className="mt-5" />
          </div>
        </nav>
      </Modal>
    </>
  );
};
