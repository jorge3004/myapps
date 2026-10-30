import { defaults } from "../data/initializations";

export const verifyDataType = (server, client = false) => {
  let localUpdate = false;
  let serverUpdate = false;
  for (const key in server) {
    if (key !== "ready")
      if (defaults[key] !== undefined) {
        if (typeof server[key] === defaults[key].dataType) {
          if (client !== false) {
            if (!(server[key] === client[key] || key === "jir3dAPIs")) {
              console.log(
                key +
                  ": no iguales client-server, re-escribiento cliente de servidor"
              );
              localUpdate = true;
            }
          }
        } else {
          console.log(
            key + ": incorrecto tipado en servidor, configurando a defaults"
          );
          serverUpdate = true;
          if (key === "jir3dAPIs")
            server[key] = {
              default: defaults[key].default,
              apis: defaults[key].apis,
            };
          else server[key] = defaults[key].default;
        }
      } else {
        if (client !== false) {
          if (client[key] !== undefined) {
            if (server[key] !== client[key]) {
              console.log(
                key +
                  ": no iguales client-server, re-escribiento cliente de servidor"
              );
              localUpdate = true;
            }
          } else {
            console.log(
              key + ": no existe en cliente, agregándolo de servidor"
            );
            localUpdate = true;
          }
        }
      }
  }
  return { server, serverUpdate, localUpdate };
};

export const verifyDefaults = (server) => {
  let serverUpdate = false;
  for (const key in defaults) {
    if (defaults[key].required?.verification === true) {
      if (typeof server[key] !== defaults[key].dataType) {
        if (server[key] !== undefined)
          console.log(
            key + ": tiene default con tipado incorecto, corrigiendo"
          );
        else console.log(key + ": no existe en server, agregando");
        serverUpdate = true;
        if (key === "jir3dAPIs")
          server[key] = {
            default: defaults[key].default,
            apis: defaults[key].apis,
          };
        else server[key] = defaults[key].default;
      }
    }
  }
  return { server, serverUpdate };
};
