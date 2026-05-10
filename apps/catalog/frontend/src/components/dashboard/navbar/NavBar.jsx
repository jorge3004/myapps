import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

import UserMenu from './userMenu/UserMenu';
import SearchBar from './SearchBar';
import AddCatalogButton from './AddCatalogButton';
import { useTranslation } from 'react-i18next';

import MenuIcon from '@mui/icons-material/Menu';


import { useLocation } from 'react-router-dom';

const NavBar = ({ onMenuClick, onSearch, onAddClick }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  // Determinar placeholder según la ruta
  let searchPlaceholder = t('search.placeholder', 'Search...');
  if (location.pathname.startsWith('/dashboard/users')) {
    searchPlaceholder = t('search.users', 'Search users');
  } else if (location.pathname.startsWith('/dashboard/catalog')) {
    searchPlaceholder = t('search.catalogs', 'Search catalogs');
  }

  if (!user) return null;

  const initials = user.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
    : user.username
      ? user.username[0].toUpperCase()
      : '';

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        {onMenuClick && (
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { xs: 'inline-flex', sm: 'none' } }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <SearchBar onSearch={onSearch} placeholder={searchPlaceholder} />
          <AddCatalogButton onClick={onAddClick} />
        </Box>
        <UserMenu
          user={user}
          anchorEl={anchorEl}
          handleMenu={handleMenu}
          handleClose={handleClose}
          initials={initials}
          displayName={user.name || user.username}
        />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
