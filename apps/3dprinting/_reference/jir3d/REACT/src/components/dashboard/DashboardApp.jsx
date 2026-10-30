import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useResizeDebounceDispatch } from "../../hooks/useResizeDebounceDispatch";
import { NavBar } from "../../components/navbar/NavBar";
import { useSelector } from "react-redux";
import { Loading } from "../utilities/Loading";
import { PrintModal } from "../utilities/ImprimirNivelar_Modal/PrintModal";
import { InfoModal } from "../utilities/InfoModal";
import { Modal_uploadFile } from "./modals/Modal_uploadFile";
import { useSetPrice } from "../../hooks/useSetPrice";
import { useInitiation } from "../../hooks/useInitiation";
import { jir3dRoles } from "../../helpers/jir3dRoles";
import { UserManagementApp } from "./users/UserManagementApp";
import { OrdenesApp } from "./ordenes/OrdenesApp";
import { RepositorioApp } from "./repositorio/RepositorioApp";
import { ThingsApp } from "./thingiverse/ThingApp";
import { CartApp } from "./cart/CartApp";
// import { AppSocket } from "./socket/AppSocket";
import { UploadApp } from "./upload/UploadApp";
import { PrintersApp } from "./printers/PrintersApp";

export const DashboardApp = React.memo(() => {
  const { util } = useSelector((state) => state.util);
  const { user } = useSelector((state) => state.user);
  const { admin, adminFetch } = jir3dRoles(user)
  const otherRoute = <Navigate to={
    `${!admin ? "carrito" : !!user.lastPath ? user.lastPath : "usuarios"
    }`} />
  const [DebouncedHandleResized] = useResizeDebounceDispatch();
  useEffect(() => {
    window.addEventListener("resize", DebouncedHandleResized);
    return () => {
      window.removeEventListener("resize", DebouncedHandleResized);
    };
  }, [DebouncedHandleResized]);

  // useSetPrice();
  useInitiation()
  // useFirstLoadingPrinter()
  return (
    <>
      <NavBar />
      {
        util.verified
          ?
          <Loading msg={"Verificando..."} />
          : util.error_verification
            ?
            <div className="container text-center">
              <text className="text-light ">
                Error de Servidor API, contacta administrador.
              </text>
            </div>
            :
            <>
              <Routes>
                {
                  admin &&
                  <>
                    <Route path="usuarios" element={<UserManagementApp />} />
                    <Route path="ordenes" element={<OrdenesApp />} />
                    <Route path="repositorio" element={<RepositorioApp />} />
                  </>
                }
                {
                  (!!user.iid || admin) &&
                  <Route path="impresoras" element={<PrintersApp />} />
                }
                <Route path="/busqueda/*" element={<ThingsApp />} />
                <Route path="carrito" element={<CartApp />} />
                {
                  (admin || user.uploadActivated) &&
                  < Route path="upload" element={<UploadApp />} />
                }
                {/* {
                  adminFetch &&
                  <Route path="test" element={<AppSocket />} />
                } */}
                <Route path="*" element={otherRoute} />
              </Routes>
            </>
      }
      {util.modal?.action === "infoModal" && <InfoModal />}
      {util.modal?.action === "uploadFileFromOrdenes" && <Modal_uploadFile header={"Subir Gcode"} />}
      {util.modal?.action === "uploadFileFromRepositorio" && <Modal_uploadFile modalMode={"add"} header={"Añadir Gcode a modelo"} />}
      {util.modal?.action === "updateFileFromRepositorio" && <Modal_uploadFile modalMode={"update"} header={"Actualizar modelo"} />}
      {util.modal?.action === "deleteFileFromRepositorio" && <Modal_uploadFile modalMode={"delete"} header={"Eliminar modelo"} />}
      {util.modal?.action === "getFileFromRepositorio" && <Modal_uploadFile modalMode={"get"} header={"Ver gcode"} />}
    </>
  );
});
