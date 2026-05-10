import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import RoleSelect from './RoleSelect';
import ApproveButton from './ApproveButton';
import ApproveIconButton from './ApproveIconButton';
import { useTranslation } from 'react-i18next';

const UserCard = ({
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
    <Card sx={{ mb: 1, display: 'flex', flexDirection: 'column', minHeight: 0, alignItems: 'center', position: 'relative', p: 2 }}>
      {/* Floating action icons on card, aligned with 'Usuario:' label */}
      <Box sx={{ position: 'absolute', top: 32, right: 8, display: 'flex', flexDirection: 'column', gap: 0.5, zIndex: 2 }}>
        {user.status === 'pending' && (
          <ApproveIconButton onClick={() => onApprove(user.id)} loading={approving} />
        )}
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
        {!showReactivate && (
          <Tooltip title={t('users.header.actions')} arrow>
            <IconButton color="error" size="small" onClick={() => setConfirmOpen(true)} sx={{ background: 'white', boxShadow: 1, p: '2px' }} disabled={deleting}>
              {/* Eliminar */}
              <svg width="18" height="18" style={{ display: 'block' }}><rect width="18" height="18" fill="none" /></svg>
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          pb: '12px !important',
          minHeight: 0,
          flex: 1,
          width: '100%',
          fontSize: { xs: '0.78rem', sm: '0.95rem' },
        }}
      >
        <Box
          component="dl"
          sx={{
            m: 0,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            rowGap: 1,
            columnGap: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Acciones unificadas (aprobación usuario y solicitud de contraseña) */}
          <Box sx={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', mt: 1 }}>
            {/* Aprobar usuario */}
            {user.status === 'pending' && (
              <Tooltip title={t('Aprobar usuario')}>
                <span>
                  <ApproveIconButton onClick={() => onApprove(user.id)} loading={approving} />
                </span>
              </Tooltip>
            )}
            {/* Solicitud de cambio de contraseña */}
            {passwordRequest && passwordRequest.status === 'pending' && (
              <Tooltip title={t('forgot.admin.approve')}>
                <span>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onApprovePasswordRequest(passwordRequest.id)}
                    disabled={pwLoading}
                    aria-label="Aprobar solicitud de contraseña"
                  >
                    <span role="img" aria-label="Aprobar contraseña">🔑</span>
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {passwordRequest && passwordRequest.status === 'pending' && (
              <Tooltip title={t('forgot.admin.reject')}>
                <span>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onRejectPasswordRequest(passwordRequest.id)}
                    disabled={pwLoading}
                    aria-label="Rechazar solicitud de contraseña"
                  >
                    <span role="img" aria-label="Rechazar contraseña">❌</span>
                  </IconButton>
                </span>
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
          </Box>
          <Typography component="dt" variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.80rem', sm: '0.95rem' } }}>
            {t('users.header.user')}
          </Typography>
          <Box component="dd" sx={{ m: 0, minWidth: 110, maxWidth: 110, fontWeight: 'bold', fontSize: { xs: '0.86rem', sm: '0.98rem' }, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.username}
          </Box>
          <Box sx={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', mt: 0.5, mb: 0.5 }}>
            <Typography component="dt" variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.90rem' }, pr: 1, minWidth: 0 }}>
              {t('users.header.role')}
            </Typography>
            <Box component="dd" sx={{ m: 0, display: 'flex', alignItems: 'center', gap: 0, minWidth: 80, maxWidth: 110, fontSize: { xs: '0.78rem', sm: '0.95rem' } }}>
              <RoleSelect
                value={roleEdit ?? user.role}
                onChange={e => onRoleChange(user.id, e.target.value)}
                disabled={user.username === 'admin'}
                sx={{ minWidth: 80, maxWidth: 110, fontSize: '0.85rem' }}
              />
              {roleEdit !== undefined && roleEdit !== user.role && (
                <IconButton
                  onClick={() => onSaveRole(user.id)}
                  disabled={user.username === 'admin'}
                  color="secondary"
                  size="small"
                  sx={{ ml: 0.5 }}
                  aria-label={t('users.header.role')}
                >
                  <SaveOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t('deleteConfirmTitle', 'Delete user?')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? t('loading', 'Deleting...') : t('delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserCard;
