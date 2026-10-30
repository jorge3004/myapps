import React from "react";
import ReactPaginate from "react-paginate";
import { thingiverse } from "../../../data/initializations";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { editUser } from "../../../store/thunks/thunksUsers";
import { getThings } from "../../../store/thunks/thunksThingiverse";
import queryString from "query-string";

export const Pagination = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { thingiverse: thingiverseFetched } = useSelector(
    (state) => state.thingiverse
  );

  const pageCount = Math.ceil(
    thingiverseFetched.total / thingiverse.postsPerPage
  );

  let { q, page } = queryString.parse(location.search);
  const handlePageClick = ({ selected }) => {
    const categoria = user.categoria || q
    page = selected + 1;
    const lastPath = `/dashboard/busqueda?q=${categoria}&page=${page}`;
    dispatch(getThings({ categoria, page }));
    navigate(lastPath);
    dispatch(editUser({ newUser: { page, lastPath } }, user.uid));
  };
  return (
    <div>
      <>
        {!!pageCount && (
          <ReactPaginate
            className="pagination justify-content-center"
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageLinkClassName="page-link"
            previousClassName="page-link"
            activeLinkClassName="bg-primary text-white"
            nextClassName="page-link"
            previousLabel="<-"
            nextLabel=" ->"
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={!!user.page ? (user.page - 1) : (Number(page) - 1)}
          />
        )}
      </>
    </div>
  );
};
