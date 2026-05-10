import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserManagerHeader = () => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            width: { xs: '40%', sm: '30%' },
            minWidth: { xs: 60, sm: 100 },
            px: 1,
            py: 0.5,
            fontSize: { xs: '0.85rem', sm: '1rem' },
          }}
        >
          {t('users.header.user', 'Usuario')}
        </TableCell>
        <TableCell
          align="center"
          sx={{
            width: { xs: '30%', sm: '25%' },
            minWidth: { xs: 50, sm: 80 },
            px: 1,
            py: 0.5,
            fontSize: { xs: '0.85rem', sm: '1rem' },
          }}
        >
          {t('users.header.role', 'Rol')}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            width: { xs: '30%', sm: '45%' },
            minWidth: { xs: 60, sm: 120 },
            px: 1,
            py: 0.5,
            fontSize: { xs: '0.85rem', sm: '1rem' },
          }}
        >
          {t('users.header.actions', 'Acciones')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UserManagerHeader;
