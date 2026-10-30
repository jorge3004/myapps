import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { CardContent, CardHeader } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GenericIcons } from "../../utilities/GenericIcons";
import { useSelector } from "react-redux";
import { jir3dRoles } from "../../../helpers/jir3dRoles";
import { usePrinterStatus } from '../../../hooks/usePrinterStatus';
export const PrinterGrid = ({ impresora }) => {
  const { user } = useSelector(state => state.user)
  const { adminFetch } = jir3dRoles(user)
  const { color, state } = usePrinterStatus(impresora)
  return (
    <Grid
      item xs={12} sm={4} md={4} lg={4} xl={2}
    >
      <Card
        sx={{
          color: color,
          // display: 'flex',
          // flexDirection: 'column',
        }}
      >
        <Box
          display='flex'
        // sx={{ padding: '0px 10px' }}
        >
          <CardHeader
            title={impresora.nombre}

          // subheader={state}
          />
          <CardHeader
            subheader={state}
            // flex='1 0 auto'
            // disableTypography
            sx={{
              // backgroundColor: 'red'
            }}
          />
          {
            adminFetch &&
            // adminFetch && (!printerStatus || (printerStatus && (!printerStatus.printing || !printerStatus.sleeping))) &&
            <Box
              display="flex"
              alignItems="center"
            >
              <GenericIcons
                action="edit"
                tmp={impresora}
              />
              <GenericIcons
                action="delete"
                tmp={impresora}
              />
            </Box>
          }
        </Box>
        {/* <CardContent
        
        </CardContent> */}
        {/* <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton> */}
      </Card>
    </Grid>
  )
};