import React from 'react';
import { Button } from '@mui/material';

const ApproveButton = ({ onClick, loading }) => (
  <Button
    onClick={onClick}
    disabled={loading}
    variant="contained"
    color="success"
    size="small"
    sx={{ minWidth: 80 }}
  >
    {loading ? 'Aprobando...' : 'Aprobar'}
  </Button>
);

export default ApproveButton;
