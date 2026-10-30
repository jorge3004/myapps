import React from "react";
import * as FaIcons from "react-icons/fa";
import { useSelector } from "react-redux";

export const PrinterGridBody = ({ impresora, printerStatus }) => {
  const { impresion } = useSelector(state => state.util.util)
  const { lan } = useSelector(state => state.user.user)
  // const { timeLeft, printTime } = printerStatus;
  // const { nombre } = impresora
  const myImpresion = !!impresion && impresion[nombre]
  const nivelarFn = () => {
    dispatch(setModal({ action: "nivelar", impresora }))
  };
  return (
    <div className="card-body text-center m-0 p-0">
      {
        true ?
          // printerStatus?.inAction ?
          <>
            {/* <div className="d-flex list-group-item">
              <li className="d-flex mx-auto">
                <h2 className="my-auto">{lan === "MX" ? "Restante" : "Time Left"}:</h2>
                <h1 className="ms-1 fw-bold my-auto">{timeLeft}</h1>
              </li>
              <li className="d-flex mx-auto">
                <h2 className="my-auto">{lan === "MX" ? "En curso.:" : "Print Time"}</h2>
                <h1 className="ms-1 fw-bold my-auto">
                  {printTime}
                </h1>
              </li>
            </div> */}
            {/* {
              myImpresion ?
                <>
                  <img src={myImpresion.tsrc} className="w-50 my-2" alt="..." />
                  <div className="fw-bolder">{myImpresion.desc}</div>
                </>
                : <></>
            } */}
          </>
          :
          <>
            {
              true && (
                // impresora.octo?.state !== "nueva impresora" && (
                <>
                  {/* <button
            className="btn btn-light border-dark m-2 "
            onClick={() => opAsync("down", "bajando")}
          >
            <FaIcons.FaArrowDown />
          </button> */}
                  {/* <button
                    className="btn btn-light border-dark my-3"
                    onClick={nivelarFn}
                  >
                    {lan === "MX" ? "Nivelar" : "Level"}
                    <FaIcons.FaExpandArrowsAlt className="mx-2" />
                  </button> */}

                  {/* <button
            className="btn btn-light border-dark m-2"
            onClick={() => opAsync("up", "subiendo")}
          >
            <FaIcons.FaArrowUp />
          </button> */}
                </>
              )
            }
          </>
      }

    </div>
  );
};
