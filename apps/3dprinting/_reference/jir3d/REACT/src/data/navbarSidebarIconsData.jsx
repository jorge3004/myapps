import React from "react";
// import * as FaIcons from "react-icons/fa";
import * as VscIcons from "react-icons/vsc";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi";
import * as ImIcons from "react-icons/im";
import * as TbIcons from "react-icons/tb";

export const adminNavbarSidebarIcons = [
  {
    title: "Upload",
    path: "upload",
    icon: <ImIcons.ImUpload />,
    role: "admin"
  },
  {
    title: "Adm Usuarios",
    path: "usuarios",
    icon: <FiIcons.FiUsers />,
    role: "admin"
  },
  {
    title: "Impresoras",
    path: "impresoras",
    icon: <BsIcons.BsPrinter />,
    role: ""
  },
  {
    title: "Repositorio",
    path: "repositorio",
    icon: <VscIcons.VscFileSubmodule />,
    role: "admin"
  },
  {
    title: "Ordenes",
    path: "ordenes",
    icon: <MdIcons.MdOutlineDriveFolderUpload />,
    role: "admin"
  },
  {
    title: "Carrito",
    path: "carrito",
    icon: <BsIcons.BsCart />,
    role: ""
  },
  {
    title: "Test",
    path: "test",
    icon: <TbIcons.TbTestPipe />,
    role: ""
  },
];

let nonAdminIcons = ["ordenes", "repositorio", "usuarios"];

const nonAdminIconsFn = (array, fields) => {
  fields = Array.isArray(fields) ? fields : [fields];
  return array.filter((item) => !fields.some((field) => item["path"] === field));
};

export let nonAdminNavbarSidebarIcons = nonAdminIconsFn(
  adminNavbarSidebarIcons,
  nonAdminIcons,
);



