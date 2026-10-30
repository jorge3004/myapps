import { RepositorioItem_Dim } from "./RepositorioManagemenItem/RepositorioItem_Dim";
import { RepositorioItem_Time } from "./RepositorioManagemenItem/RepositorioItem_Time";
import { RepositorioItem_Precio } from "./RepositorioManagemenItem/RepositorioItem_Precio";
import { RepositorioItem_Img } from "./RepositorioManagemenItem/RepositorioItem_Img";
import { RepositorioItem_Remove } from "./RepositorioManagemenItem/RepositorioItem_Remove";
import { RepositorioItem_Add } from "./RepositorioManagemenItem/RepositorioItem_Add";
import { RepositorioItem_Update } from "./RepositorioManagemenItem/RepositorioItem_Update";
import { RepositorioItem_Get } from "./RepositorioManagemenItem/RepositorioItem_Get";
import { PrintIcon } from "../_Icons/PrintIcon";

export const RepositorioManagementItem = ({ repositorio }) => {
  return (
    <>
      <tr className="align-middle">
        <td>{repositorio.tid}</td>
        <RepositorioItem_Dim repositorio={repositorio} />
        <RepositorioItem_Time repositorio={repositorio} />
        <RepositorioItem_Precio repositorio={repositorio} />
        <RepositorioItem_Img repositorio={repositorio} />
        <td>
          <PrintIcon item={repositorio} classAtt="me-3" />
          <RepositorioItem_Remove repositorio={repositorio} />
          <RepositorioItem_Update repositorio={repositorio} />
          <RepositorioItem_Add repositorio={repositorio} />
          <RepositorioItem_Get repositorio={repositorio} />
        </td>
      </tr>
    </>
  );
};
