import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { editUser } from "../../../store/thunks/thunksUsers";

export const DarkModeSwitchJir3d = () => {
  const { uid, darkMode } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const toggleDarkMode = () => {
    dispatch(editUser({ darkMode: !darkMode }, uid));
  };

  return (
    <div className="text-center py-2 text-light mt-5 pt-4">
      <DarkModeSwitch
        checked={darkMode}
        onChange={toggleDarkMode}
        size={25}
      />
    </div>
  );
};
