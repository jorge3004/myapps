import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Tooltip from '@mui/material/Tooltip';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PDFPreviewWithZoom from '../../components/dashboard/catalogManager/PDFPreviewWithZoom';

import {
  // Lógica de catálogos movida a useCatalogs
} from '../../api/catalogApi';
import {
  Box,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ModalLoader from '../../components/ModalLoader';
import { useCatalogsContext } from '../../context/CatalogsContext';
import { useAuth } from '../../context/AuthContext';
import CatalogCardList from '../../components/dashboard/catalogManager/CatalogCardList';
// import CatalogUploadModal from '../../components/dashboard/catalogManager/forms/CatalogUploadModal';
import CatalogTableList from '../../components/dashboard/catalogManager/table/CatalogTableList';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useOutletContext } from 'react-router-dom';




const CatalogManager = () => {
  const { user } = useAuth();
  // Mover hook aquí
  const outletContext = useOutletContext();
  const { t } = useTranslation();

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl('');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  // const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const token = localStorage.getItem('token');

  // Al abrir el modal, empuja un nuevo estado al historial. Al presionar atrás, cierra el modal.
  React.useEffect(() => {
    if (!previewOpen) return;
    const handlePopState = (e) => {
      setPreviewOpen(false);
      setPreviewUrl('');
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Si el modal se cierra por otro medio, regresa el historial a la normalidad
      if (window.history.state === null) window.history.back();
    };
  }, [previewOpen]);

  // Custom hook para lógica de catálogos
  const {
    catalogs,
    loading,
    error,
    uploading,
    handleUpload: hookHandleUpload,
    handleDelete: hookHandleDelete,
    setError,
  } = useCatalogsContext();

  // Asegura que la vista previa siempre use la URL real del PDF
  const handlePreview = (urlOrId) => {
    let url = urlOrId;
    if (typeof urlOrId === 'number') {
      const cat = catalogs.find(c => c.id === urlOrId);
      if (cat && cat.url) url = cat.url;
    }
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  // Wrapper para el form
  const handleUpload = (e) => {
    hookHandleUpload(e, name, file);
    setFile(null);
    setName('');
  };

  // Wrapper para el delete con confirmación
  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este catálogo?')) {
      hookHandleDelete(id);
      // Si necesitas usar openGlobalModal, accede así:
      // const { openGlobalModal } = outletContext || {};
      // ...
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, position: 'relative' }}>
      {error && <Typography color="error">{error}</Typography>}
      {isMobile ? (
        <CatalogCardList
          catalogs={catalogs}
          onPreview={handlePreview}
          onDownload={() => { }}
          onDelete={handleDelete}
          userRole={user?.role}
        />
      ) : (
        <CatalogTableList
          catalogs={catalogs}
          handlePreview={handlePreview}
          handleDelete={handleDelete}
          userRole={user?.role}
        />
      )}
      <ModalLoader open={loading} message={t('catalog.loading', 'Loading catalogs...')} />
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth={false}
        // fullScreen
        PaperProps={{
          sx: {
            width: '95vw',
            height: '95vh',
            maxWidth: '95vw',
            maxHeight: '95vh',
            m: 'auto',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pr: 1, py: 0.5, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ width: '100%' }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 500, fontSize: '0.95rem', maxWidth: '90vw', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {
                previewUrl
                  ? (catalogs.find(cat => cat.url === previewUrl)?.name || 'PDF')
                  : 'PDF'
              }
            </Typography>
          </span>
        </DialogTitle>
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          {previewUrl ? (
            <PDFPreviewWithZoom fileUrl={previewUrl} onClose={handleClosePreview} />
          ) : (
            <Typography>No se pudo cargar el PDF.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CatalogManager;
