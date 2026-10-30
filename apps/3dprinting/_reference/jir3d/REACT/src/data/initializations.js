const defaultJir3dAPI = (user) => {
  const hostname = window.location.hostname;
  if (hostname.includes("localhost")) return "http://localhost:3001";
  // if (hostname.includes("puebla")) return "https://api.puebla.jir3d.com.mx";
  if (hostname.includes("jir3d")) return "https://dev.api.jir3d.com";
  // return "https://dev.api.jir3d.com";
};
export const defaults = {
  usuario: {
    default: "",
    dataType: "string",
  },
  clave: {
    default: "",
    dataType: "string",
  },
  impresora: {
    default: "",
    dataType: "string",
  },
  temaDark: {
    default: true,
    options: [true, false],
    required: { verification: true },
    dataType: "boolean",
  },
  idioma: {
    default: "ES",
    options: ["ES", "EN"],
    dataType: "string",
  },
  jir3dAPIs: {
    default: defaultJir3dAPI(),
    apis: { "https://api.jir3d.com.mx": false, "http://localhost:3010": false },
    required: { verification: true },
    dataType: "object",
  },
  tipo: {
    default: "",
    options: ["admin", "op"],
    dataType: "string",
  },
  page: {
    default: 1,
    dataType: "number",
    required: { verification: true },
  },
  categoria: {
    default: "",
    dataType: "string",
    required: { verification: true },
  },
  lastPath: {
    default: "/dashboard/busqueda",
    dataType: "string",
  },
  logged: {
    default: false,
    dataType: "boolean",
    required: { verification: true },
  },
  autosync: {
    default: true,
    dataType: "boolean",
    required: { verification: true },
  },
};

export const usuarioTemplate = (user) => {
  return {
    [user.lan === "MX" ? "usuario" : "user"]: "",
    [user.lan === "MX" ? "clave" : "password"]: "",
  };
}
export const usuario = {
  usuario: "",
  clave: "",

}

export const impresora = {
  nombre: "",
};

export const thingiverse = {
  postsPerPage: 9,
};

export const filament = {
  densidad: 1.25,
  diametro: 1.75,
};

export function toGrams(filamento) {
  return (
    (filament.densidad *
      filamento *
      Math.PI *
      filament.diametro *
      filament.diametro) /
    4
  ).toFixed(2);
}
export function secondsToHms(s) {
  s = Number(s);
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  // var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h === 1 ? " h, " : " h ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? " m, " : " m ") : "";
  // var sDisplay = s > 0 ? s + (s === 1 ? " s" : " seg") : "";
  return hDisplay + mDisplay;
  // + sDisplay;
}

export const refreshIntervalPrinters = 2000;

export const elapseSecondsToWait = 20;

export const tempNozzle = { min: 180, max: 220, default: 185, increment: 5 };
export const tempBed = { min: 0, max: 60, default: 40, increment: 5 };
export const levelBedParam = {
  min: 0,
  max: 0.25,
  default: 0,
  increment: 0.025,
};

export const phoneModeLimit = 576;

export const headers = {
  // "Content-Type": "multipart/form-data",
  // "Content-Type": "multipart/form-data",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Request-Headers": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};
