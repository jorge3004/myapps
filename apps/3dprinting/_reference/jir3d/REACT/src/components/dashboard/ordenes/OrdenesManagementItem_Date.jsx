import React from "react";
import { useSelector } from "react-redux";

export const OrdenesManagementItem_Date = ({ orden }) => {
  const { screenSize } = useSelector((state) => state.screenSize);
  const data1 = orden.createdAt
  const data2 = Date.parse(data1)
  const data3 = new Date(data2);//this is the format you have
  const data4 = data3.toLocaleDateString().split('/').join('-')
  const data5 = data3.toLocaleTimeString() //this converts it to necessary format
  const data6 = data4 + " " + data5

  var datePart = data3.getDate() + "-" + data3.getMonth() + "-" + data3.getFullYear();
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var secs = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + secs + ' ' + ampm;
    return strTime;
  }
  var timePart = formatAMPM(data3);


  function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("az", { timeZone: tzString }));
  }
  const n = convertTZ(data1, 'Mexico/General')
  const esDate = new Intl.DateTimeFormat("az").format(data2);



  const lastDate = (date) => {
    !!orden.dateCotiza &&
      screenSize.isPhoneMode
      ? date
        .replace("GMT-0500 (Central Daylight Time)", "")
        .slice(0, 10)
      : date
        .replace("GMT-0500 (Central Daylight Time)", "")
        .slice(0, 10)
    return date
  }
  return (
    <>
      <td>
        {lastDate(esDate)}
      </td>
    </>
  );
};
