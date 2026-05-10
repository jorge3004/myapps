import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import NavBar from '../components/dashboard/navbar/NavBar';
import UserCreateModal from '../components/dashboard/userManager/forms/UserCreateModal';
import Sidebar from '../components/dashboard/Sidebar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CatalogsProvider } from '../context/CatalogsContext';

const NAVBAR_HEIGHT = 64; // Altura estándar de AppBar/Toolbar


const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const location = useLocation();

  const { t } = useTranslation();
  // Hook para sincronizar last_route
  // Determinar título según la ruta, usando i18n
  let titleKey = 'navbar.catalog';
  if (location.pathname.startsWith('/dashboard/users')) {
    titleKey = 'navbar.users';
  } else if (location.pathname.startsWith('/dashboard/catalog')) {
    titleKey = 'navbar.catalogManager';
  } else if (location.pathname.startsWith('/dashboard')) {
    titleKey = 'navbar.dashboard';
  }
  const title = t(titleKey);

  // Estado y lógica para modal global reutilizable
  const [globalModal, setGlobalModal] = React.useState({
    open: false,
    type: null, // 'catalog', 'user', etc.
    props: {},  // props específicos del modal
  });


  // Handler para abrir el modal correcto según la ruta
  const handleAddClick = () => {
    if (location.pathname.startsWith('/dashboard/users')) {
      setGlobalModal({ open: true, type: 'user', props: { isMobile } });
    } else if (location.pathname.startsWith('/dashboard/catalog')) {
      setGlobalModal({ open: true, type: 'catalog', props: { isMobile } });
    }
  };

  // Handler para cerrar el modal global
  const handleCloseGlobalModal = () => setGlobalModal((prev) => ({ ...prev, open: false }));

  // Estado de búsqueda global
  const [search, setSearch] = React.useState('');

  return (
    <CatalogsProvider>
      {/* NavBar fijo arriba */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1201 }}>
        <NavBar
          onMenuClick={isMobile ? handleDrawerToggle : undefined}
          title={title}
          onSearch={setSearch}
          onAddClick={handleAddClick}
        />
      </Box>
      {/* Layout principal con Sidebar y contenido, debajo del NavBar */}
      <Box sx={{ display: 'flex', flex: 1, pt: `${NAVBAR_HEIGHT}px` }}>
        {/* Sidebar solo ocupa espacio en desktop */}
        {!isMobile && (
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, width: '100%' }}
        >
          {/* Sidebar Drawer solo en móvil (no ocupa espacio) */}
          {isMobile && (
            <Sidebar
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}
          {/* Modal global reutilizable para catálogos, usuarios, etc. */}
          {globalModal.type === 'catalog' && (
            <React.Suspense fallback={null}>
              {React.createElement(
                require('../components/dashboard/catalogManager/forms/CatalogUploadModal').default,
                {
                  open: globalModal.open,
                  onClose: handleCloseGlobalModal,
                  ...globalModal.props,
                }
              )}
            </React.Suspense>
          )}
          {globalModal.type === 'user' && (
            <UserCreateModal open={globalModal.open} onClose={handleCloseGlobalModal} />
          )}
          {/* Outlet para páginas, pasar handlers y search global */}
          <Outlet context={{
            openGlobalModal: (type, props = {}) => setGlobalModal({ open: true, type, props }),
            closeGlobalModal: handleCloseGlobalModal,
            globalModal,
            search,
          }} />
        </Box>

      </Box>
    </CatalogsProvider>
  );
};

export default DashboardLayout;
