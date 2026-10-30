export const secondsToMHMS = (seconds) => {
  seconds = Number(seconds);
  var days = Math.floor(seconds / (24 * 60 * 60));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);

  var dDisplay = days > 0 ? " " + days + "d" : " ";
  var hDisplay = h > 0 ? " " + h + "h" : " ";
  var mDisplay = m > 0 ? " " + m + "m" : "-";

  const output = dDisplay + hDisplay + mDisplay;
  // seconds <= 60 ? "0m" : h <= 24 ? hDisplay + mDisplay : dDisplay + hDisplay;
  return output;
};
