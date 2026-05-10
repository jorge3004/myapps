import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RoleSelect from './RoleSelect';
import ApproveButton from './ApproveButton';
import { TableRow, TableCell, IconButton, Box, Tooltip, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const UserRow = ({
  user,
  roleEdit,
  approving,
  savingRole,
  onRoleChange,
  onApprove,
  onSaveRole,
  onDelete,
  deleting,
  passwordRequest,
  onApprovePasswordRequest,
  onRejectPasswordRequest,
  pwLoading,
  showReactivate = false,
  onReactivateUser,
}) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const handleDelete = () => {
    setConfirmOpen(false);
    onDelete && onDelete(user.id);
  };
  return (
    <TableRow
      sx={{
        backgroundColor: user.status === 'pending' ? 'action.hover' : 'inherit',
      }}
    >
      <TableCell
        sx={{
          wordBreak: 'break-word',
          width: { xs: '40%', sm: '30%' },
          minWidth: { xs: 60, sm: 100 },
          px: 1,
          py: 0.5,
          fontSize: { xs: '0.85rem', sm: '1rem' },
        }}
      >
        {user.username}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          width: { xs: '30%', sm: '25%' },
          minWidth: { xs: 50, sm: 80 },
          px: 1,
          py: 0.5,
          maxWidth: 70,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <RoleSelect
            value={roleEdit ?? user.role}
            onChange={(e) => onRoleChange(user.id, e.target.value)}
            disabled={user.username === 'admin'}
          />
          {roleEdit !== undefined && roleEdit !== user.role && (
            <IconButton
              onClick={() => onSaveRole(user.id)}
              disabled={user.username === 'admin'}
              color="secondary"
              size="small"
              aria-label="Guardar rol"
            >
              <SaveOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </TableCell>
      <TableCell
        align="right"
        sx={{
          width: { xs: '30%', sm: '45%' },
          minWidth: { xs: 60, sm: 120 },
          px: 1,
          py: 0.5,
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 0.5,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {/* Aprobar usuario */}
          {user.status === 'pending' && (
            <ApproveButton
              onClick={() => onApprove(user.id)}
              loading={approving}
            />
          )}
          {/* Solicitud de cambio de contraseña */}
          {passwordRequest && passwordRequest.status === 'pending' && (
            <Tooltip title={t('forgot.admin.approve')}>
              <IconButton
                color="primary"
                size="small"
                onClick={() => onApprovePasswordRequest(passwordRequest.id)}
                disabled={pwLoading}
                aria-label={t('forgot.admin.approve')}
              >
                <span role="img" aria-label={t('forgot.admin.approve')}>🔑</span>
              </IconButton>
            </Tooltip>
          )}
          {passwordRequest && passwordRequest.status === 'pending' && (
            <Tooltip title={t('forgot.admin.reject')}>
              <IconButton
                color="error"
                size="small"
                onClick={() => onRejectPasswordRequest(passwordRequest.id)}
                disabled={pwLoading}
                aria-label={t('forgot.admin.reject')}
              >
                <span role="img" aria-label={t('forgot.admin.reject')}>❌</span>
              </IconButton>
            </Tooltip>
          )}
          {passwordRequest && passwordRequest.status === 'approved' && (
            <Tooltip title={t('forgot.admin.approved')}>
              <span style={{ color: 'green', fontSize: 18, marginLeft: 4 }}>🔓</span>
            </Tooltip>
          )}
          {passwordRequest && passwordRequest.status === 'rejected' && (
            <Tooltip title={t('forgot.admin.rejected')}>
              <span style={{ color: 'red', fontSize: 18, marginLeft: 4 }}>⛔</span>
            </Tooltip>
          )}
          {passwordRequest && passwordRequest.status === 'cancelled' && (
            <Tooltip title={t('forgot.admin.cancelled')}>
              <span style={{ color: 'orange', fontSize: 18, marginLeft: 4 }}>🚫</span>
            </Tooltip>
          )}
          {/* Guardar ahora es un icono junto al dropdown */}
          {/* Botón eliminar usuario SOLO en columna acciones (pantalla grande) */}
          {/* Eliminar usuario solo si NO está en modo reactivar */}
          {!showReactivate && (
            <Tooltip title={t('users.header.actions')} arrow>
              <span>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => setConfirmOpen(true)}
                  disabled={deleting}
                  sx={{ background: 'white', boxShadow: 1, p: '2px', display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  <DeleteOutlineOutlinedIcon fontSize="inherit" style={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {/* Botón reactivar usuario si showReactivate está activo */}
          {showReactivate && (
            <Tooltip title={t('users.reactivate', 'Reactivar usuario')} arrow>
              <span>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onReactivateUser && onReactivateUser(user.id)}
                  disabled={deleting}
                  sx={{ background: 'white', boxShadow: 1, p: '1px' }}
                >
                  <RestoreFromTrashOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>
              {t('deleteConfirmTitle', '¿Eliminar usuario?')}
              <br />
              <span style={{ fontWeight: 500, color: '#d32f2f' }}>{user.username}</span>
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>{t('cancel', 'Cancelar')}</Button>
              <Button onClick={handleDelete} color="error" autoFocus>{t('delete', 'Eliminar')}</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
