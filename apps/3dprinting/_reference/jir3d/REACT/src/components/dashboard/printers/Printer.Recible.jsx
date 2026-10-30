// import { useDispatch, useSelector } from "react-redux";
// import { Loading } from "../../utilities/Loading";
// import { setImpresion, setPrinterGStatus, setPrintersGStatus } from "../../../store/slices/utilSlice";
// import { defaults } from "../../../data/initializations";
// import axios from "axios"
// import { jir3dRoles } from "../../../helpers/jir3dRoles";
// import * as BsIcons from "react-icons/bs";
// import { GenericIcons } from "../../utilities/GenericIcons";
// import { editarImpresora, removeImpresora } from "../../../store/thunks/thunksImpresoras";
// import * as FaIcons from "react-icons/fa";

// const { loading, inAction } = printerStatus
// const printerStatus = printersGStatus[nombre]
// const exec = async (comando) => {
//   let newlastAction = comando
//   if (lastPrint === "nivelar") {
//     if (comando === "continuar")
//       if (lastAction.indexOf("continuar_nivelar_") >= 0) {
//         const step = Number(lastAction.charAt(lastAction.length - 1)) + 1
//         newlastAction = "continuar_nivelar_" + step
//       } else if (lastAction === "iniciado") {
//         newlastAction = "continuar_nivelar_1"
//       }

//     const payload = { comando, lastAction: newlastAction }
//     const params = { ...printersGStatus, [nombre]: { ...printersGStatus[nombre], loading: true } }
//     dispatch(editarImpresora(payload, iid));
//     dispatch(setPrintersGStatus(params));
//   } else {
//     const payload = { comando, lastAction: comando }
//     const params = { ...printersGStatus, [nombre]: { ...printersGStatus[nombre], loading: true } }
//     dispatch(editarImpresora(payload, iid));
//     dispatch(setPrintersGStatus(params));
//   }
// }

// const onOff = () => {
//   // dispatch(
//   //   setOperationAsync({
//   //     comando: impresora.octo?.state === "Closed" ? "on" : "off",
//   //     msg:
//   //       impresora.octo?.state === "Closed"
//   //         ? "Despertando Impresora"
//   //         : "Durmiendo impresora",
//   //     impresora: impresora.nombre,
//   //   }));
// };

// if (inAction && lastPrint !== "nivelar") {
//   if (!(!!impresion && !!impresion[nombre])) {
//     const retrivedRep = async () => {
//       const { data } = await axios(`${repositorioEndPoint}/${lastPrint}`)
//       dispatch(setImpresion({ [nombre]: data }))
//     }
//     retrivedRep()
//   }
// }

// !!printerStatus &&
{/* {
        loading ?
          <Loading msg={""} />
          :
          <>
            {
              inAction &&
              <div className={`card-footer text-center `}>
                {
                  !printing &&
                  <button
                    className="btn btn-light border-dark my-3 mx-2 "
                    onClick={() => exec("continuar")}
                  >
                    <FaIcons.FaPlay color={"green"} />
                  </button>
                }
                {paused && <button
                  className="btn btn-light border-dark my-3 mx-2 "
                  onClick={() => exec("reiniciar")}
                >
                  <FaIcons.FaRedo />
                </button>}
                <button
                  className="btn btn-light border-dark my-3 mx-2 "
                  onClick={() => exec("parar")}
                >
                  <FaIcons.FaStop color={"red"} />
                </button>
                {
                  !paused &&
                  <button
                    className="btn btn-light border-dark my-3 mx-2 "
                    onClick={() => exec("pausar")
                    }
                  >
                    <FaIcons.FaPause color={"yellow"} />
                  </button>
                }
              </div>
            }
          </>
      } */}


{/* <>
  <button className="btn btn-light border-dark " onClick={onOff}>
    <FiIcons.FiPower
      className={`${impresora.octo?.state === "Closed" ? "text-success" : "text-warning"
        }`}
    />
  </button>
</> */}



// const repositorioEndPoint = `${defaults.jir3dAPIs.default}/repositorio`;
// const dispatch = useDispatch()
// const { printersGStatus, impresion } = useSelector((state) => state.util.util);
// const { nombre, lastPrint, lastAction, idd } = impresora
// const { printing, paused } = printerStatus
// const { state, completion, inAction } = printerStatus
// const { user } = useSelector(state => state.user)
// const { adminFetch } = jir3dRoles(user)
// const { lan } = useSelector(state => state.user.user)
// const { color } = printerStatus
// const color = colorPrinterGridItem(impresora);
// const { color } = printerStatus
// const { printing, sleeping, inAction, on } = printerStatus
// const { iid, isActive, price } = impresora
// const titleProps = lan === "MX" ? "Configuración de Impresora" : "Printer Configuration"

// HEADER

// const { lastSeen } = printerStatus
// const [elapse, setElapse] = useState()
// const flashing =
//   "animate__animated animate__flash animate__slow animate__infinite	infinite";
// const params = ["bedTemp", "nozzleTemp"]
// const title = lan === "MX" ? { bedTemp: "Cama", nozzleTemp: "Nozzle" } : { bedTemp: "Bed", nozzleTemp: "Nozzle" }
// useEffect(() => {
//     let invervalId
//     if (!!lastSeen) {
//         setElapse(Date.now() - lastSeen)
//         invervalId = setInterval(() => {
//             setElapse(Date.now() - lastSeen)
//         }, 1500);
//     }
//     return () => {
//         clearInterval(invervalId)
//     }
// }, [printerStatus])

{/* {
                    on ?
                        inAction &&
                        <div className="d-flex w-50 justify-content-center">
                            {
                                params.map(item => {
                                    const { actual, inRange, target } = printerStatus[item]
                                    return <div key={item} >
                                        <h2 className={`fw-bold m-auto text-danger text-center px-2 px-md-3`}>
                                            {title[item]}
                                        </h2>
                                        <h1 className={`fw-bold m-auto text-danger text-center px-2 px-md-3 fw-bold ${!inRange && flashing} `}>
                                            {actual}
                                            {`${!inRange ? `/${target}` : ""}`}°C
                                        </h1>
                                    </div>
                                })
                            }
                        </div >
                        :
                        <div className="m-auto d-flex">
                            <h1 className={` fw-bold m-auto d-flex text-danger px-3`}>
                                {secondsToMHMS(elapse / 1000)}
                            </h1>
                        </div>
                } */}
{/* <PrinterGridHeaderCenter_Wifi
                  printerStatus={printerStatus}
                /> */}

