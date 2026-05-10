import React from 'react';
import UserManagerHeader from './UserManagerHeader';
import UserRow from './UserRow';
import UserCard from './UserCard';
import ApproveIconButton from './ApproveIconButton';
import { Table, TableBody, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const UserTable = ({
  users,
  roleEdits,
  approving,
  savingRole,
  onRoleChange,
  onApprove,
  onSaveRole,
  onDelete,
  deleting,
  passwordRequests = [],
  onApprovePasswordRequest,
  onRejectPasswordRequest,
  pwLoading,
  showReactivate = false,
  onReactivateUser,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr' },
          gap: 1.5,
          width: '100%',
          mt: 1,
        }}
      >
        {users.map((user) => {
          const pwRequest = passwordRequests.find(r => r.user_id === user.id);
          return (
            <UserCard
              key={user.id}
              user={user}
              roleEdit={roleEdits[user.id]}
              approving={approving[user.id]}
              savingRole={savingRole[user.id]}
              onRoleChange={onRoleChange}
              onApprove={onApprove}
              onSaveRole={onSaveRole}
              onDelete={onDelete}
              deleting={deleting[user.id]}
              ApproveButtonComponent={ApproveIconButton}
              passwordRequest={pwRequest}
              onApprovePasswordRequest={onApprovePasswordRequest}
              onRejectPasswordRequest={onRejectPasswordRequest}
              pwLoading={pwLoading}
              showReactivate={showReactivate}
              onReactivateUser={onReactivateUser}
            />
          );
        })}
      </Box>
    );
  }

  return (
    <Table sx={{ minWidth: 600, width: '100%' }}>
      <UserManagerHeader />
      <TableBody>
        {users.map((user) => {
          const pwRequest = passwordRequests.find(r => r.user_id === user.id);
          return (
            <UserRow
              key={user.id}
              user={user}
              roleEdit={roleEdits[user.id]}
              approving={approving[user.id]}
              savingRole={savingRole[user.id]}
              onRoleChange={onRoleChange}
              onApprove={onApprove}
              onSaveRole={onSaveRole}
              onDelete={onDelete}
              deleting={deleting?.[user.id]}
              passwordRequest={pwRequest}
              onApprovePasswordRequest={onApprovePasswordRequest}
              onRejectPasswordRequest={onRejectPasswordRequest}
              pwLoading={pwLoading}
              showReactivate={showReactivate}
              onReactivateUser={onReactivateUser}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

export default UserTable;
