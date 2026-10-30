import React from "react";
import { useSelector } from "react-redux";
import { jir3dRoles } from "../../../helpers/jir3dRoles";
import { GenericDropDown } from "../../utilities/GenericDropDown";
import { GenericIcons } from "../../utilities/GenericIcons";
export const UserManagementTableItem = ({ usuario }) => {
  const { user } = useSelector((state) => state.user);
  const { adminFetch } = jir3dRoles(user)
  const { impresoras } = useSelector((state) => state.impresoras);
  return (
    <tr>
      <td>
        { // Role Dropdown
          (usuario.tipo || adminFetch) &&
          <GenericDropDown
            action={'userRole'}
            tmp={usuario}
          />
        }
      </td>
      <td>
        { // User Name
          usuario.usuario
        }
      </td>
      <td>
        { // Impresora Dropdown
          !!impresoras.impresoras && impresoras.impresoras.length > 0 &&
          <GenericDropDown
            action="userPrinter"
            tmp={usuario}
          />
        }
      </td>
      <td>
        <GenericIcons action={'edit'} tmp={usuario} /> {/* Edit Icon */}
        {
          usuario.uid !== user.uid && // Delete Icon
          <GenericIcons action={'delete'} tmp={usuario} />
        }
      </td>
    </tr>
  );
};
