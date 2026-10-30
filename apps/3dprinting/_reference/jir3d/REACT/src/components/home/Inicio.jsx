import React from "react";
import _3dPrinter from "/assets/images/home/3dprinter.png";
// import _3dPrinter from "../../assets/images/home/3dprinter.png";

const Inicio = () => {
  return (
    <div className="container ini">
      <div className="row justify-content-center mt-5 pt-5 ">
        <div className="col-11 col-sm-10 col-md-10 col-lg-5 col-xl-5 align-self-center ">
          <div className="text-center ">
            <h1 className="display-4">¡Impresión 3D al alcancesss de todos!</h1>
            {/* <h1 className="display-4">{` ${process.env.REACT_APP_NAME}`}</h1> */}
          </div>
          <div className=" text-center">
            <h1 className="display-1 text-warning ini-p">
              ¡Conoce nuestros productos y servicios!
            </h1>
          </div>
        </div>
        <div className="col-md-10 col-lg-7 col-xl-5 col-xxl-4 ini-img align-self-center ">
          <img className="img-fluid" src={_3dPrinter} alt="Impresora" />
        </div>
      </div>
    </div>
  );
};
export default Inicio;
