import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const AddCatalogButton = ({ onClick, sx }) => (
    <Fab
        color="primary"
        aria-label="subir catálogo"
        size="small"
        onClick={onClick}
        sx={{ ml: 2, ...sx }}
    >
        <AddIcon />
    </Fab>
);

export default AddCatalogButton;
