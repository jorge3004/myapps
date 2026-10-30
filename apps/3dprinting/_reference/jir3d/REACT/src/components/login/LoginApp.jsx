import React, { useEffect, useRef } from "react";
import { useForm } from "../../hooks/useForm";
import { Loading } from "../utilities/Loading";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/images/home/logo.png";
import { setAuthentificationError } from "../../store/slices/utilSlice";
import { LoginGoogle } from "./LoginGoogle";
import { userAuthentication } from "../../store/thunks/thunksAuth";


export const LoginApp = () => {
  const [credentials, handleInputChange] = useForm({ usuario: "", clave: "" });
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { util } = useSelector((state) => state.util);
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (credentials.usuario.trim() === "") {
      dispatch(setAuthentificationError("Favor de ingresar su usuario"));
    } else if (credentials.clave.trim() === "") {
      dispatch(setAuthentificationError("Favor de ingresar su contraseña"));
    } else {
      dispatch(userAuthentication(credentials));
    }
  };

  return (
    <div className="main-Verification1 d-flex justify-content-center pt-5">
      <form className="text-center " onSubmit={handleSubmit}>
        <img alt="logoJir3D" className="mb-2" src={logo}></img>
        <input
          type="text"
          name="usuario"
          className="pswBtn mb-2"
          placeholder="USUARIO"
          onChange={handleInputChange}
          ref={inputRef}
        // onFocus={focusFunc}
        // autoComplete="off"
        // autoFocus
        />
        <input
          type="password"
          name="clave"
          className="pswBtn"
          placeholder="CONTRASEÑA"
          onChange={handleInputChange}
        />
        {!!util.error_authentification &&
          util.error_authentification !== "" && (
            <div className="errorMessage">{util.error_authentification}</div>
          )}
        {util.authentification === false ? (
          <Loading />
        ) : (
          <button type="submit" className="access btn btn-outline-light mt-4">
            Acceder
          </button>
        )}
        {/* <LoginGoogle /> */}
      </form>
    </div>
  );
};
