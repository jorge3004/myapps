import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { editUser } from "../../store/thunks/thunksUsers";
import * as FaIcons from "react-icons/fa";
import { getThings } from "../../store/thunks/thunksThingiverse";
import queryString from "query-string";


export const NavBardDashboardSearchBar = () => {
  const { user } = useSelector((state) => state.user);
  const { screenSize } = useSelector((state) => state.screenSize);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pathname, search } = useLocation();
  const { q, page: page2 } = queryString.parse(search);

  let page = user.page ? user.page : page2 ? page2 : 1
  let categoria = user.categoria ? user.categoria : q ? q : ""

  const [inputValues, handleInputChange, setInputValues] = useForm({
    busqueda: categoria,
  });
  const categoriaSearch = inputValues?.busqueda.trim();
  let searchPath = (catetegoria, page) => {
    return `/dashboard/busqueda?q=${catetegoria}&page=${page}`;
  };
  useEffect(() => {
    pathname === "/dashboard/busqueda" && setInputValues({ busqueda: categoria });
    return () => {
      pathname === "/dashboard/busqueda" && setInputValues({ busqueda: "" });
    };
  }, [user.lastPath]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lastPath = searchPath(categoria, page);
    if (pathname === "/dashboard/busqueda") {
      if (categoriaSearch !== categoria) {
        // console.log("En busqueda, categorias iguales, catSearch: ", categoriaSearch, " ,cat: ", categoria);
        page = 1;
        categoria = categoriaSearch;
        dispatch(getThings({ categoria, page }));
        dispatch(editUser({ newUser: { categoria, page, lastPath } }, user.uid));
        navigate(searchPath(categoria, page));
      }
    } else {
      if (categoriaSearch === categoria || categoriaSearch.length === 0) {
        // console.log("Fuera de busqueda, categorias iguales o catSearch Vacio, catSearch: ", categoriaSearch, " ,cat: ", categoria);
        setInputValues({ busqueda: categoria });
        navigate(searchPath(categoria, page));
        dispatch(editUser({ newUser: { lastPath } }, user.uid));
      }
      else {
        // console.log("Fuera de busqueda, categorias NO iguales y catSearch Con algo, catSearch: ", categoriaSearch, " ,cat: ", categoria);
        categoria = categoriaSearch;
        page = 1;
        dispatch(getThings({ categoria, page }));
        navigate(searchPath(categoria, page));
        dispatch(editUser({ newUser: { categoria, page, lastPath } }, user.uid));
      }
      // // dispatch(activateThingiverseWait());
    }
  };
  return (
    <div
      className={`navbar-nav nav-link m-auto w-75 ${screenSize.isPhoneMode && "pt-0 w-100 pe-0"
        }`}
    >
      <form className="input-group" onSubmit={handleSubmit}>
        <input
          type="search"
          name="busqueda"
          className="form-control"
          placeholder={user.lan === "MX" ? "Buscar" : "Search"}
          // onFocus={({ target }) => {
          //   setInputValues({ busqueda: categoria });
          // }}
          // onBlur={(e) => {
          //   setInputValues({ busqueda: "" });
          // }}
          value={inputValues.busqueda}
          onChange={handleInputChange}
          aria-label="Search"
          aria-describedby="search-addon"
        />
        <button
          type="submit"
          // onClick={handleSubmit}
          className="btn btn-outline-secondary "
        >
          <FaIcons.FaSearch className="search" />
        </button>
      </form>
    </div>
  );
};
