import React from "react";
import { useSelector } from "react-redux";
import { userColor } from "../../../helpers/userColor";
import { PrinterGrid } from "./PrinterGrid";
import { Loading } from "../../utilities/Loading";
import { jir3dRoles } from "../../../helpers/jir3dRoles";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { GenericButtons } from "../../utilities/GenericButtons";

export const PrintersApp = () => {
  const { user } = useSelector((state) => state.user);
  // const { printersGStatus } = useSelector((state) => state.util.util);
  const { impresoras } = useSelector((state) => state.impresoras.impresoras);
  const { text } = userColor(user)
  const { adminFetch } = jir3dRoles(user)
  const { lan } = user
  const impresorastoMap =
    user.iidSelected
      ?
      impresoras?.filter((impresora) => impresora.nombre === user.iidSelected)
      :
      impresoras

  return (
    <>
      <div className="headTitleJir3d">
        <h1 className={`${text}`}>{lan === "MX" ? "Mis Impresoras" : "My printer"}</h1>
        {
          adminFetch &&
          <GenericButtons
            action="add"
          />
        }
      </div>
      {/* <div className="d-flex justify-content-center mb-4">
        {
          !!impresoras &&
          <GenericDropDown
            action={'printersVisible'}
          />
        }
      </div> */}
      {
        !!impresoras ?
          // printersGStatus ?
          impresoras?.length > 0
            ?
            <>
              {
                <Container
                  maxWidth="md"
                >
                  <Grid
                    spacing={4}
                    container
                  >
                    {
                      impresorastoMap.map((impresora) => (
                        < PrinterGrid key={impresora.nombre} impresora={impresora} />
                      ))
                    }
                  </Grid>
                </Container>
              }
            </>
            :
            <div className={`m-auto text-center ${text}`}>
              {user.lan === "MX" ? "No existen impresoras" : "No printers"}
            </div>
          :
          <Loading msg="" />
      }
    </>
  );
}