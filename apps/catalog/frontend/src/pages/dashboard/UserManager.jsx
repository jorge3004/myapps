const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' },
];

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Typography, Box, Chip, Stack } from '@mui/material';
import ModalLoader from '../../components/ModalLoader';
import UserTable from '../../components/dashboard/userManager/UserTable';
import useUsers from '../../hooks/user/useUsers';
import useApproveUser from '../../hooks/user/useApproveUser';
import useEditRole from '../../hooks/user/useEditRole';
import useDeactivateUser from '../../hooks/user/useDeactivateUser';
import * as passwordResetApi from '../../api/passwordResetApi';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';

const UserManager = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const { users, setUsers, loading, error, setError } = useUsers(token);
  const { search = '' } = useOutletContext?.() || {};
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Lee el filtro de la URL al montar
  const getFilterFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (['active', 'requests', 'inactive'].includes(filter)) return filter;
    return 'active';
  };
  const [userTab, setUserTab] = useState(getFilterFromUrl()); // 'active', 'inactive', 'requests'
  // Sincroniza el filtro con la URL al cambiar userTab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (userTab !== params.get('filter')) {
      params.set('filter', userTab);
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line
  }, [userTab]);

  // Si la URL cambia (ej: por navegación manual), actualiza el filtro
  useEffect(() => {
    const filter = getFilterFromUrl();
    if (filter !== userTab) setUserTab(filter);
    // eslint-disable-next-line
  }, [location.search]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  // Cargar usuarios desactivados si se activa el filtro
  useEffect(() => {
    async function fetchInactive() {
      if (userTab !== 'inactive') return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/users?status=inactive`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setInactiveUsers(data.users || []);
      } catch {
        setInactiveUsers([]);
      }
    }
    fetchInactive();
  }, [userTab, token]);

  // Cargar solicitudes de cambio de contraseña
  useEffect(() => {
    async function fetchRequests() {
      setPwLoading(true);
      setPwError(null);
      try {
        const res = await passwordResetApi.getPasswordResetRequests();
        setPasswordRequests(res.requests);
      } catch (err) {
        setPwError(err.message || 'Error al cargar solicitudes de contraseña');
      }
      setPwLoading(false);
    }
    fetchRequests();
  }, []);

  // Acciones de aprobar/rechazar
  const handleApprovePasswordRequest = async (requestId) => {
    setPwLoading(true);
    setPwError(null);
    try {
      await passwordResetApi.approvePasswordResetRequest(requestId);
      const res = await passwordResetApi.getPasswordResetRequests();
      setPasswordRequests(res.requests);
    } catch (err) {
      setPwError(err.message || 'Error al aprobar solicitud');
    }
    setPwLoading(false);
  };
  const handleRejectPasswordRequest = async (requestId) => {
    setPwLoading(true);
    setPwError(null);
    try {
      await passwordResetApi.rejectPasswordResetRequest(requestId);
      const res = await passwordResetApi.getPasswordResetRequests();
      setPasswordRequests(res.requests);
    } catch (err) {
      setPwError(err.message || 'Error al rechazar solicitud');
    }
    setPwLoading(false);
  };
  const { approving, handleApprove } = useApproveUser(
    token,
    setUsers,
    setError,
  );
  const {
    roleEdits,
    setRoleEdits,
    savingRole,
    handleRoleChange,
    handleSaveRole,
  } = useEditRole(token, setUsers, setError);
  const { deactivating, handleDeactivate } = useDeactivateUser(token, setUsers, setError);

  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Acceso restringido: solo administradores pueden ver el gestor de usuarios.
        </Typography>
      </Box>
    );
  }

  // Reactivar usuario
  const handleReactivateUser = async (userId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'active' }),
      });
      const data = await res.json();
      if (data.success) {
        setInactiveUsers((prev) => prev.filter((u) => u.id !== userId));
        setUsers((prev) => {
          // Si ya existe en activos, solo actualiza status; si no, lo agrega en orden por id ascendente
          const reactivated = inactiveUsers.find(u => u.id === userId);
          if (!reactivated) return prev;
          const exists = prev.some(u => u.id === userId);
          let updated;
          if (exists) {
            updated = prev.map(u => u.id === userId ? { ...u, status: 'active' } : u);
          } else {
            updated = [...prev, { ...reactivated, status: 'active' }];
          }
          // Ordenar por id ascendente (igual que el backend)
          return updated.slice().sort((a, b) => a.id - b.id);
        });
      } else {
        setError(data.message || 'Error al reactivar usuario');
      }
    } catch (err) {
      setError('Error al reactivar usuario');
    }
  };


  // Función de filtro por búsqueda (nombre, username, email)
  const filterUsers = (userList) => {
    if (!search) return userList;
    const s = search.toLowerCase();
    return userList.filter(u =>
      (u.name && u.name.toLowerCase().includes(s)) ||
      (u.username && u.username.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s))
    );
  };

  // Filtrar usuarios para la pestaña de solicitudes pendientes
  const pendingUserIds = new Set([
    ...users.filter(u => u.status === 'pending').map(u => u.id),
    ...passwordRequests.filter(r => r.status === 'pending').map(r => r.user_id)
  ]);
  const requestUsers = users.filter(u => pendingUserIds.has(u.id));

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, position: 'relative' }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Chip
            label={t('users.activeTag', 'Activos')}
            color={userTab === 'active' ? 'primary' : 'default'}
            onClick={() => setUserTab('active')}
            clickable
          />
          <Chip
            label={t('users.requestsTag', 'Solicitudes pendientes')}
            color={userTab === 'requests' ? 'primary' : 'default'}
            onClick={() => setUserTab('requests')}
            clickable
          />
          <Chip
            label={t('users.inactiveTag', 'Desactivados')}
            color={userTab === 'inactive' ? 'primary' : 'default'}
            onClick={() => setUserTab('inactive')}
            clickable
          />
        </Stack>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        {error && <Typography color="error">{error}</Typography>}
        {pwError && <Typography color="error">{pwError}</Typography>}
        {userTab === 'active' && (
          <UserTable
            users={filterUsers(users.filter(u => u.status === 'active'))}
            roleEdits={roleEdits}
            approving={approving}
            savingRole={savingRole}
            onRoleChange={handleRoleChange}
            onApprove={handleApprove}
            onSaveRole={handleSaveRole}
            onDelete={handleDeactivate}
            deleting={deactivating}
            passwordRequests={passwordRequests}
            onApprovePasswordRequest={handleApprovePasswordRequest}
            onRejectPasswordRequest={handleRejectPasswordRequest}
            pwLoading={pwLoading}
          />
        )}
        {userTab === 'requests' && (
          <UserTable
            users={filterUsers(requestUsers)}
            roleEdits={roleEdits}
            approving={approving}
            savingRole={savingRole}
            onRoleChange={handleRoleChange}
            onApprove={handleApprove}
            onSaveRole={handleSaveRole}
            onDelete={handleDeactivate}
            deleting={deactivating}
            passwordRequests={passwordRequests}
            onApprovePasswordRequest={handleApprovePasswordRequest}
            onRejectPasswordRequest={handleRejectPasswordRequest}
            pwLoading={pwLoading}
          />
        )}
        {userTab === 'inactive' && (
          <UserTable
            users={filterUsers(inactiveUsers)}
            roleEdits={{}}
            approving={{}}
            savingRole={{}}
            onRoleChange={() => { }}
            onApprove={() => { }}
            onSaveRole={() => { }}
            onDelete={() => { }}
            deleting={{}}
            passwordRequests={[]}
            onApprovePasswordRequest={() => { }}
            onRejectPasswordRequest={() => { }}
            pwLoading={false}
            showReactivate
            onReactivateUser={handleReactivateUser}
          />
        )}
        <ModalLoader open={loading || pwLoading} message={t('users.loading', 'Loading users...')} />
      </Box>
    </Box>
  );
};

export default UserManager;
