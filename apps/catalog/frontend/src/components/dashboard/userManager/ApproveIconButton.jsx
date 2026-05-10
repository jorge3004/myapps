import React from 'react';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ApproveIconButton = ({ onClick, loading }) => (
  <Tooltip title={loading ? 'Aprobando...' : 'Aprobar'} arrow>
    <span>
      <IconButton
        onClick={onClick}
        disabled={loading}
        color="success"
        size="small"
        sx={{ p: 0.5 }}
        aria-label="Aprobar"
      >
        {loading ? <CircularProgress size={20} color="success" /> : <CheckCircleIcon fontSize="small" />}
      </IconButton>
    </span>
  </Tooltip>
);

export default ApproveIconButton;
