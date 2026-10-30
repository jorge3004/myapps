import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
// import { activateCarritoMainView } from "../../../store/slices/carritoSlice";
// import { useDispatch } from "react-redux";

export const CartManagementHeader = () => {
  const { user } = useSelector((state) => state.user);
  const color = userColor(user)

  return (
    <>
      {/* <div className="p-2">
        <h4>Shopping cart</h4>
        <div className="d-flex flex-row align-items-center pull-right">
          <span className="mr-1">Sort by:</span>
          <span className="mr-1 font-weight-bold">Price</span>
          <i className="fa fa-angle-down"></i>
        </div>
      </div> */}
      <div className="headTitleJir3d">
        {/* {!carrito.carritoTemp?.viewMain && (
        <i
          className="fas fa-arrow-alt-circle-left"
          onClick={() => dispatch(activateCarritoMainView())}
          id="userManagement_cart-Back-Arrow"
        ></i>
      )} */}
        <h1 className={`${color.text}`}>
          {user.lan == "MX" ? "Mi carrito" : "Cart"}
        </h1>
      </div>
    </>
  );
};
