import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Box, IconButton, Avatar, Tooltip } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const CatalogCard = ({ catalog, onPreview, onDownload, onDelete, userRole }) => {
  // Si tienes un thumbnail, úsalo aquí. Si no, usa un ícono por defecto.
  const thumbnail = catalog.thumbnail_url || null;
  // Nuevo tamaño
  const thumbWidth = 96;
  const thumbHeight = 135;
  const { t } = useTranslation();
  return (
    <Card sx={{ mb: 1.2, display: 'flex', flexDirection: 'column', minHeight: 0, alignItems: 'center', position: 'relative', p: 2 }}>
      {/* Floating action icons on card, aligned with thumbnail top, smaller size */}
      <Box sx={{ position: 'absolute', top: 32, right: 8, display: 'flex', flexDirection: 'column', gap: 0.5, zIndex: 2 }}>
        {userRole === 'admin' && (
          <>
            <Tooltip title={t('catalog.card.download', 'Download PDF')} arrow>
              <IconButton component="a" href={catalog.url} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'grey.600', background: 'white', boxShadow: 1, mb: 0.2, p: '2px' }}>
                <CloudDownloadIcon fontSize="inherit" style={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('catalog.card.delete', 'Delete')} arrow>
              <IconButton onClick={() => onDelete(catalog.id)} size="small" sx={{ color: 'grey.600', background: 'white', boxShadow: 1, p: '2px' }}>
                <DeleteOutlineOutlinedIcon fontSize="inherit" style={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
      <Box sx={{ width: thumbWidth, height: thumbHeight, mb: 1, mt: 1 }}>
        <Box
          sx={{ width: thumbWidth, height: thumbHeight, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => onPreview(catalog.id)}
          title={t('catalog.card.preview', 'Preview PDF')}
        >
          {thumbnail ? (
            <Avatar variant="rounded" src={thumbnail} alt={catalog.name} sx={{ width: thumbWidth, height: thumbHeight, boxShadow: 1 }} />
          ) : (
            <Avatar variant="rounded" sx={{ width: thumbWidth, height: thumbHeight, bgcolor: 'grey.200', color: 'grey.600', fontSize: 36 }}>
              PDF
            </Avatar>
          )}
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.primary"
        align="center"
        sx={{
          mt: 0.5,
          fontWeight: 500,
          fontSize: '0.85rem',
          width: '100%',
          maxWidth: '100%',
          wordBreak: 'break-word',
          textAlign: 'center',
          display: 'block',
        }}
      >
        {catalog.name}
      </Typography>
    </Card>
  );
};

export default CatalogCard;
