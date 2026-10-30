
// import React, { useState } from "react";
// // import * as FaIcons from "react-icons/fa";
// import * as FiIcons from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "../../../../../hooks/useForm";
// // import SuccessAnimation from "actually-accessible-react-success-animation";
// import { Loading } from "../../../../utilities/Loading";
// import { editarImpresora, getImpresoras } from "../../../../../store/thunks/thunksImpresoras";
// import { setPrice } from "../../../../../store/slices/utilSlice";

// export const PrinterConfigModal_price = () => {
//   // const { user } = useSelector((state) => state.user);
//   // const { impresoras } = useSelector((state) => state.user);
//   const { util } = useSelector((state) => state.util);
//   const dispatch = useDispatch();
//   const inp = util.modal?.price;
//   const [input, setInput] = useState(inp);
//   const [error, setError] = useState(false);
//   const [done, setDone] = useState(false);
//   const [waiting, setWaiting] = useState(false);
//   const [inputValues, handleInputChange, setInputValues] = useForm({
//     price: !!inp ? inp : "",
//   });
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isNaN(inputValues.price) || inputValues.price === "") {
//       setError("Favor de ingresar un numero");
//     } else if (Number(inputValues.price) <= 0) {
//       setError("Favor de ingresar un numero mayor que 0");
//     } else if (Number(inputValues.price) > 5) {
//       setError("Favor de ingresar un numero menor que 5");
//     } else {
//       setError("");
//       setWaiting(true);
//       dispatch(setPrice(Number(inputValues.price)))
//       dispatch(
//         editarImpresora({ price: inputValues.price })
//       );
//       setTimeout(() => {
//         setInput(inputValues.price);
//         setDone(true);
//         setWaiting(false);
//       }, [1000]);
//     }
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         className="text-center d-flex justify-content-center"
//       >
//         <div className="d-flex justify-content-center align-self-center">
//           Precio/Gram($)
//         </div>
//         <input
//           type="search"
//           name="price"
//           className="form-control w-25 ms-2 align-self-center text-center"
//           placeholder="Precio"
//           value={`${inputValues.price}`}
//           onChange={handleInputChange}
//           disabled={waiting}
//         />
//         <button
//           type="submit"
//           className="btn btn-outline-secondary me-2"
//           disabled={input === inputValues.price || waiting}
//         >
//           <FiIcons.FiSave className="search" />
//         </button>
//         {waiting && <Loading msg="" />}
//       </form>

//       {error && (
//         <div className="text-center text-danger mt-3 pt-0">{error}</div>
//       )}
//     </>
//   );
// };



// import React from "react";
// import * as FiIcons from "react-icons/fi";

// export const PrinterConfigModal_scripts = () => {
//     return (
//         <>
//             <div className="text-center">
//                 After print job completes : <></>
//                 <FiIcons.FiCopy
//                     onClick={() =>
//                         // navigator.clipboard.writeText()
//                         navigator.clipboard.writeText(
//                             `
// M81
//               `
//                         )
//                     }
//                     className="mx-3"
//                 />
//             </div>
//             <div className="text-center">
//                 After print job is cancelled : <></>
//                 <FiIcons.FiCopy
//                     onClick={() =>
//                         navigator.clipboard.writeText(
//                             `
// M84 ; disable motors 
// G91 ; Relative positioning
// G1 E-2 F2700 ;Retract a bit
// G1 E-2 Z0.2 F2400 ;Retract and raise Z
// G1 X5 Y5 F3000 ; Wipe out
// G1 Z10 ; Raise Z more
// G90 ; Absolute positioning

// G1 X0 Y235 ;Present print
// M106 S0 ;Turn-off fan
// M104 S0 ;Turn-off hotend
// M140 S0 ;Turn-off bed

// M84 X Y E ; Disable all steppers but Z

// M106 S0
// M81
//               `
//                         )
//                     }
//                     className="mx-3"
//                 />
//             </div>
//             <div className="text-center">
//                 After print job is paused : <></>
//                 <FiIcons.FiCopy
//                     onClick={() =>
//                         navigator.clipboard.writeText(
//                             `
// {% if pause_position.x is not none %}
// ; relative XYZE
// G91
// M83

// ; retract filament of 0.8 mm up, move Z slightly upwards and 
// G1 X-20 E-8 F4500
// G1 Z+5 F4500

// ; absolute XYZE
// M82
// G90

// ; move to a safe rest position, adjust as necessary
// ; G1 X0 Y0
// G1 X0 Y200 F1000 ; Present Print

// {% endif %}
//               `
//                         )
//                     }
//                     className="mx-3"
//                 />
//             </div>
//             <div className="text-center">
//                 Before print job is resumed : <></>
//                 <FiIcons.FiCopy
//                     onClick={() =>
//                         navigator.clipboard.write(
//                             `
// {% if pause_position.x is not none %}
// ; relative extruder
// M83

// ; prime nozzle
// G1 E10 F4500

// ; absolute E
// M82

// ; absolute XYZ
// G90

// ; reset E
// G92 E{{ pause_position.e }}

// ; WARNING!!! - use M83 or M82(extruder absolute mode) according what your slicer generates
// M82 ; extruder relative mode

// ; move back to pause position XYZ
// G1 X{{ pause_position.x }} Y{{ pause_position.y}} Z{{pause_position.z }} F4500

// ; reset to feed rate before pause if available
// {% if pause_position.f is not none %}G1 F{{pause_position.f}{% endif %}
// {% endif %}
//               `
//                         )
//                     }
//                     className="mx-3"
//                 />
//             </div>
//         </>
//     );
// };



// import React from "react";
// import * as FaIcons from "react-icons/fa";

// export const PrinterConfigModal_octoLink = () => {
//     return (
//         <div className="text-center">
//             {/* OctoPrint Script: <></> */}

//             <FaIcons.FaOctopusDeploy
//                 onClick={() => window.open("http://octopi.local", "_blank")}
//                 className="mx-3"
//             />
//         </div>
//     );
// };




// import React from "react";
// import * as FiIcons from "react-icons/fi";

// export const PrinterConfigModal_octo = () => {
//     return (
//         <div className="text-center">
//             OctoPrint JIR3D Script: <></>
//             <FiIcons.FiCopy
//                 onClick={() =>
//                     navigator.clipboard.writeText(
//                         "https://github.com/jorge3004/JIR3D-OCTOPRINT-SCRIPT/archive/master.zip"
//                     )
//                 }
//                 className="mx-3"
//             />
//             <FiIcons.FiDownload
//                 onClick={() =>
//                     window.open(
//                         "https://github.com/jorge3004/JIR3D-OCTOPRINT-SCRIPT/archive/refs/heads/master.zip",
//                         "_blank"
//                     )
//                 }
//                 className="mx-3"
//             />
//         </div>
//     );
// };




//      <div className="d-flex align-items-center justify-content-center">
//      <label className="toggle-container ">
//        <input
//          className="checkbox"
//          type="checkbox"
//          defaultChecked={isToggled}
//          onClick={callback}
//        />
//        <span className="slider round" />
//        <strong className={`"text-dark" toggle`}>On/Off</strong>
//      </label>
//    </div>