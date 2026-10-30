import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { defaults } from "../data/initializations";
import { activateDropdown, clearDropdown } from "../store/slices/utilSlice";
import { editUser } from "../store/thunks/thunksUsers";

export const DevMode = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { util } = useSelector((state) => state.util);
  // console.log(util);
  // console.log(user);

  return (
    <div className="d-block text-center" id="devButton">
      <div className="d-flex">
        <label className="text-muted me-1 ">DEV MODE</label>
        <label className="text-muted">Consultando:</label>
      </div>

      <Dropdown
        isOpen={util.dropdown?.action === "jir3dApiSwitch"}
        toggle={() => {
          if (util.dropdown?.action === "jir3dApiSwitch")
            dispatch(clearDropdown());
          else {
            if (!!!user.jir3dAPIs?.default) {
              const jir3dAPIs = defaults.jir3dAPIs;
              delete jir3dAPIs.dataType;
              dispatch(editUser({ inputValues: { jir3dAPIs } }));
            }
            dispatch(activateDropdown({ action: "jir3dApiSwitch" }));
          }
        }}
      >
        <DropdownToggle caret className={`bg-dark p-1 text-capitalize}`}>
          {user.jir3dAPIs?.default}
        </DropdownToggle>
        <DropdownMenu className="text-success">
          <DropdownItem onClick={async () => { }}>
            https://api.jir3d.com.mx
          </DropdownItem>
          {/* {user.jir3dAPI === "http://localhost:3010" ? (
            <DropdownItem
              onClick={async () => {
                const newjir3dAPI = "https://api.jir3d.com.mx";
                const baseUrl = `${newjir3dAPI}/usuarios.php?usuario=${user.usuario}`;
                // const response = await fetch(baseUrl);
                // const userResponse = await response.json();
                // let inputValues = userResponse;
                // for (const key in userResponse) {
                //   if (key === "jir3dAPI") inputValues[key] = newjir3dAPI;
                //   else inputValues[key] = inputValues[key] = user[key];
                // }
                dispatch(
                  editUser(
                    { inputValues: { jir3dAPI: newjir3dAPI } },
                    user.usuario,
                    baseUrl
                  )
                );
                // dispatch(clearDropdown());
              }}
            >
              https://api.jir3d.com.mx
            </DropdownItem>
          ) : (
            <DropdownItem
              onClick={async () => {
                const newjir3dAPI = "http://localhost:3010";
                const baseUrl = `${newjir3dAPI}/usuarios.php?usuario=${user.usuario}`;
                // const response = await fetch(baseUrl);
                // const userResponse = await response.json();
                // let inputValues = userResponse;
                // for (const key in userResponse) {
                //   if (key === "jir3dAPI") inputValues[key] = newjir3dAPI;
                //   else inputValues[key] = inputValues[key] = user[key];
                // }
                dispatch();
                // editUser(
                //   { inputValues: { jir3dAPI: newjir3dAPI } },
                //   user.usuario,
                //   baseUrl
                // )
              }}
            >
              http://localhost:3010
              </DropdownItem>
              
          )} */}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
