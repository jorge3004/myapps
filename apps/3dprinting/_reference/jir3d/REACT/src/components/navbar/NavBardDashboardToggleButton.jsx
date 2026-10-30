import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { verification } from "../../store/thunks/thunksAuth";
import { SideBar } from "../sidebar/SideBar";

export const NavBardDashboardToggleButton = () => {
  const [sidebar, setSidebar] = useState(false);
  return (
    <div className="navbar-nav ">
      <button
        className="navbar-toggler"
        onClick={() => {
          // dispatch(verification());
          setSidebar(true);
        }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      {sidebar && <SideBar sidebar={sidebar} setSidebar={setSidebar} />}
    </div>
  );
};
