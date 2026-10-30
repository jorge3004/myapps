import React from "react";
// const productos = require.context('../../assets/images/home/productos', true);
const heroImageUrl =  `../../../assets/images/home/productos/`

const Catalago = () => {
  return (
    <div className=" container-fluid align-items-center bg-dark">
      <div className="row justify-content-center ">
        <h1 className="display-4 text-light py-3 con" >Porta-celulares</h1>
      </div>
      <div className="row d-flex justify-content-around py-4 text-center text-white">
        <div className="col-sm-12 col-md-4 col-lg-3 ">
          {/* <img className="img-fluid" src={productos('./BC-SC-01.jpg').default} alt="Modelo BC-SC-01" /> */}
          <img className="img-fluid" src={`${heroImageUrl}BC-SC-01.jpg`} alt="Modelo BC-SC-01" />
          <h2>MODELO BC-SC-01</h2>
        </div>
        <div className="col-sm-12 col-md-4 col-lg-3">
          {/* <img className="img-fluid" src={productos('./BC-US-01.jpg').default} alt="MODELO BC-SC-01" /> */}
          <img className="img-fluid" src={`${heroImageUrl}BC-US-01.jpg`} alt="MODELO BC-SC-01" />
          <h2 >MODELO BC-SC-01</h2>
        </div>
        <div className="col-sm-12 col-md-4 col-lg-3">
          {/* <img className="img-fluid" src={productos('./BC-SC-01.jpg').default} alt="MODELO BC-SC-01" /> */}
          <img className="img-fluid" src={`${heroImageUrl}BC-SC-01.jpg`}  alt="MODELO BC-SC-01" />
          <h2>MODELO BC-SC-01</h2>
        </div>
      </div>
      <hr className="text-white" />

      <div className="row">
        <h1 className="display-4 text-light py-3 ">Corta-galletas</h1>
      </div>
      <div className=" row text-white ">
        <div className=" col-sm-12 col-md-4 col-lg-3 offset-lg-4">
          {/* <img className=" img-fluid" src={productos('./CG-FB-01.jpg').default} alt="MODELO CG-FB-01" /> */}
          <img className=" img-fluid" src={`${heroImageUrl}CG-FB-01.jpg`} alt="MODELO CG-FB-01" />
          <h2 className="text-center ">MODELO CG-FB-01</h2>
        </div>
      </div>
      <hr className="text-white" />
      <div className="row  ">
        <h1 className="display-4 text-light py-3">Salva-orejas</h1>
      </div>
      <div className=" row py-4 text-center text-white ">
        <div className=" col-sm-12 col-md-4 col-lg-3 offset-lg-4">
          {/* <img className=" img-fluid" src={productos('./SO-SC-01.jpg').default} alt="MODELO SO-SC-01" /> */}
          <img className=" img-fluid" src={`${heroImageUrl}SO-SC-01.jpg`} alt="MODELO SO-SC-01" />
          <h2>MODELO SO-SC-01</h2>
        </div>
      </div>
    </div>
  );
};
export default Catalago;
