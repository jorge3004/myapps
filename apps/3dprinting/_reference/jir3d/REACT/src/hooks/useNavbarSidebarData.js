import { useSelector } from "react-redux";
import {
  adminNavbarSidebarIcons,
  nonAdminNavbarSidebarIcons,
} from "../data/navbarSidebarIconsData";
import { jir3dRoles } from "../helpers/jir3dRoles";

export const useNavbarSidebarData = () => {
  const { user } = useSelector((state) => state.user);
  const { ordenes } = useSelector((state) => state.ordenes);
  const { carrito } = useSelector((state) => state.carrito);
  const { screenSize } = useSelector((state) => state.screenSize);

  let data = {};
  let tmpdata;
  const { admin, adminFetch } = jir3dRoles(user)

  tmpdata = admin ? adminNavbarSidebarIcons : nonAdminNavbarSidebarIcons;

  tmpdata =
    !!user.iid || adminFetch
      ? tmpdata
      : tmpdata.filter((item) => item.path !== "impresoras");

  if (!adminFetch || admin)
    tmpdata = tmpdata.filter((item) => item.path !== "test")

  if (!user.uploadActivated)
    tmpdata = tmpdata.filter((item) => item.path !== "upload")

  if (!!ordenes.ordenes) {
    for (const element of tmpdata) {
      if (element.path === "ordenes")
        element.cantidad = Object.keys(ordenes.ordenes).length;
    }
  }
  if (!!carrito?.carrito) {
    for (const element of tmpdata) {
      if (element.path === "carrito")
        element.cantidad = Object.keys(carrito.carrito).length;
    }
  }

  if (screenSize.isPhoneMode) {
    data.nav = tmpdata.filter((item) => item.path === "carrito");
    data.side = tmpdata.filter((item) => item.path !== "carrito");
  } else {
    data.nav = tmpdata;
  }

  return { side: data.side, nav: data.nav };
};
