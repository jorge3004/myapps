import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Link } from 'react-router-dom';

const drawerWidth = 220;

const allMenuItems = [
  {
    key: 'sidebar.users',
    defaultText: 'Usuarios',
    icon: <PeopleIcon />,
    path: '/dashboard/users',
    roles: ['admin'],
  },
  {
    key: 'sidebar.catalog',
    defaultText: 'Catálogo PDF',
    icon: <PictureAsPdfIcon />,
    path: '/dashboard/catalog',
    roles: ['admin', 'user'],
  },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const menuItems = allMenuItems.filter(
    (item) => user && item.roles.includes(user.role),
  );
  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.key}
            component={Link}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 600 && handleDrawerToggle)
                handleDrawerToggle();
            }}
          >
            <ListItemIcon sx={{ color: 'text.primary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={t(item.key, item.defaultText)}
              primaryTypographyProps={{
                sx: {
                  color: 'text.primary',
                  fontWeight: 400,
                  letterSpacing: 0.5,
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <nav
      style={{ width: drawerWidth, flexShrink: 0 }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

export default Sidebar;
