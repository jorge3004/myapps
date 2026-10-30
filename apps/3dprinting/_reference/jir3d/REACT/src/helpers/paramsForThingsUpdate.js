import queryString from "query-string";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const paramsForThingsUpdate = () => {
  const location = useLocation();
  const { q, page } = queryString.parse(location.search);
  const { user } = useSelector((state) => state.user);
  let params = {};
  let equalToUserFlag = {};
  let veficationFlags = {};
  if (q === user.categoria && Number(page) === user.page) {
    equalToUserFlag = { categoria: true, page: true };
  } else {
    if (q === user.categoria || Number(page) === user.page) {
      if (Number(page) === user.page) {
        console.log("_q_  no igual a user");
        equalToUserFlag = { categoria: false, page: true };
      } else {
        console.log("_page_  no igual a user");
        equalToUserFlag = { categoria: true, page: false };
      }
    } else {
      console.log("ningún parametro es igual a user");
      equalToUserFlag = { categoria: false, page: false };
    }
    if (q === undefined || q === null) {
      console.log("_q_ no está definido, o es nulo");
      params = { categoria: user.categoria };
      veficationFlags = { categoria: false };
    } else {
      console.log("_q_ valido");
      params = { categoria: q };
      veficationFlags = { categoria: true };
    }
    if (page === undefined || page === null || isNaN(Number(page))) {
      console.log("_page_ no está definido, o es nulo");
      params = { ...params, page: user.page };
      veficationFlags = { ...veficationFlags, page: false };
    } else {
      console.log("_page_ valido");
      params = { ...params, page: Number(page) };
      veficationFlags = { ...veficationFlags, page: true };
    }
  }
  return { params, equalToUserFlag, veficationFlags };
};
