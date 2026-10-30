import React from "react";
import jir3dIcon from "/assets/images/home/logo.png";
// import jir3dIcon from "../../../src/assets/images/home/logo.png";

const Footer = () => {
  return (
    <>
      <footer className="text-center text-lg-start bg-dark text-muted">
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Contactanos en nuestras redes sociales:</span>
          </div>
          <div>
            <a
              href="https://www.facebook.com/Jir3D-100534655406179"
              className="me-4 text-reset"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </section>
        <section className="">
          <div className="container text-center text-md-start ">
            <div className="row foot">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4 text-center">
                  <img src={jir3dIcon} alt="logo" />
                </h6>
                <p>Impresión 3D al alcance de todos</p>
              </div>
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
                <p>
                  <i className="fas fa-home me-3"></i> Xalapa, Veracruz, MX
                </p>
                <p>
                  <i className="fas fa-envelope me-3"></i>
                  ventas@jir3d.com
                </p>
                <p>
                  <i className="fas fa-phone me-3"></i> 229 346 370
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <div className="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05);">
                © 2021 Copyright:
                <a className="text-reset fw-bold" href="https://mdbootstrap.com/">JIR3D.com</a>
            </div> */}
      </footer>
    </>
  );
};
export default Footer;
