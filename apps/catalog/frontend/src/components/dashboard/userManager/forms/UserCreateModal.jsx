import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { createUserByAdmin } from '../../../../api/userApi';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];


const UserCreateModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [preferredName, setPreferredName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState('');
  const handleCopy = () => {
    navigator.clipboard.writeText(getLoginUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUsername('');
    setShowLink(false);
    setSuggestedUsername('');
    try {
      const res = await createUserByAdmin({ preferred_name: preferredName, last_name: lastName, role, token });
      setUsername(res.username);
      setShowLink(true);
    } catch (err) {
      if (err.suggested_username) {
        setSuggestedUsername(err.suggested_username);
        setError(t('users.suggestedUsername', 'Username already exists. Suggested:') + ' ' + err.suggested_username);
      } else {
        setError(err.message || 'Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getLoginUrl = () => {
    const base = window.location.origin;
    return `${base}/login?user=${encodeURIComponent(username)}`;
  };

  const getWhatsappUrl = () => {
    const msg = t('users.whatsappMsg', 'Hello! Your account has been created. Your username is:') + ` ${username}\n` + t('users.whatsappLogin', 'Login here:') + ` ${getLoginUrl()}`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('users.addUser', 'Add User')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('register.preferredName', 'Preferred Name')}
            value={preferredName}
            onChange={e => setPreferredName(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading || !!username}
          />
          <TextField
            label={t('register.lastName', 'Last Name')}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading || !!username}
          />
          <TextField
            select
            label={t('users.header.role', 'Role')}
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading || !!username}
          >
            {ROLE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {t(`users.roles.${opt.value}`, opt.label)}
              </MenuItem>
            ))}
          </TextField>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          {suggestedUsername && !username && (
            <div style={{ marginTop: 16 }}>
              <strong>{t('users.suggestedUsername', 'Username already exists. Suggested:')}</strong> {suggestedUsername}
              <Button
                variant="outlined"
                color="primary"
                sx={{ ml: 2 }}
                onClick={async () => {
                  setError('');
                  setLoading(true);
                  try {
                    const res = await createUserByAdmin({ preferred_name: preferredName, last_name: lastName, role, token, username: suggestedUsername });
                    setUsername(res.username);
                    setShowLink(true);
                  } catch (err2) {
                    setError(err2.message || 'Error');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {t('users.acceptSuggestion', 'Accept suggestion')}
              </Button>
            </div>
          )}
          {username && (
            <div style={{ marginTop: 16 }}>
              <strong>{t('users.usernameCreated', 'Username created')}:</strong> {username}
              <br />
              <strong>{t('users.loginLink', 'Login link')}:</strong>
              <a href={getLoginUrl()} target="_blank" rel="noopener noreferrer">{getLoginUrl()}</a>
              <Tooltip title={copied ? t('users.copied', 'Copied!') : t('users.copyLink', 'Copy link')} placement="top">
                <IconButton size="small" onClick={handleCopy} sx={{ ml: 1 }}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <br />
              <Button
                variant="outlined"
                color="success"
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                {t('users.sendWhatsapp', 'Send via WhatsApp')}
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel', 'Cancel')}</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !!username}>
            {loading ? t('register.loading', 'Registering...') : t('register.button', 'Register')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserCreateModal;
