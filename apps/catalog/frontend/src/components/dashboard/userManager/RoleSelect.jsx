import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const RoleSelect = ({ value, onChange, disabled, sx }) => {
  const { t } = useTranslation();
  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      size="small"
      sx={{
        minWidth: 80,
        maxWidth: 110,
        fontSize: '0.85rem',
        height: 26,
        ...sx,
      }}
      MenuProps={{ PaperProps: { style: { maxHeight: 180 } } }}
    >
      <MenuItem value="admin" sx={{ fontSize: '0.85rem' }}>
        {t('users.roles.admin', 'Admin')}
      </MenuItem>
      <MenuItem value="user" sx={{ fontSize: '0.85rem' }}>
        {t('users.roles.user', 'User')}
      </MenuItem>
    </Select>
  );
};

export default RoleSelect;
