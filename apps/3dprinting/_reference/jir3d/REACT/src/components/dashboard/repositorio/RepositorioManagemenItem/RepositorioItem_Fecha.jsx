import React from "react";

export const RepositorioItem_Fecha = ({ repositorio }) => {
  const { uploadTime } = repositorio;

  const milisecondsTime = Number(uploadTime);
  const tiempoSubida = new Date(milisecondsTime * 1000);
  // const dateObject = new Date(0);
  // const tiempoSubida = new Date(dateObject.setUTCSeconds(milisecondsTime));
  // const nuevo = new Date(dateObject.setUTCSeconds(milisecondsTime));

  var options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const dateString = tiempoSubida.toLocaleTimeString("es-ES", options);
  const dateArray = dateString.split(",");
  const fechaArr = dateArray[1].split(" ");
  const hora = dateArray[2].trim();

  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "am" : "pm"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      time[3] = ""; //añadido por Jorge Rivera para eliminar segundos
    }
    return time.join(""); // return adjusted time or original string
  }

  const fechaFinal =
    tiempoSubida.getDate() + "/" + fechaArr[3] + "/" + fechaArr[5];
  const horaFinal = tConvert(hora);

  return (
    <td>
      {fechaFinal}
      <br />
      {horaFinal}
    </td>
  );
};
