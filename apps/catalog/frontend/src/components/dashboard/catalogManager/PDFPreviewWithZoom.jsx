import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { Worker, Viewer } from '@react-pdf-viewer/core';
// importación de zoomPlugin y estilos
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';


// import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


const PDFPreviewWithZoom = ({ fileUrl, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover, zoomTo } = zoomPluginInstance;
  const containerRef = useRef(null);


  // Ajustar el zoom para que el PDF se vea completo (PageFit) cuando esté cargado
  const handleDocumentLoad = () => {
    setTimeout(() => {
      zoomTo && zoomTo('PageFit');
    }, 250);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '90vh', background: '#f8f8f8' }}>
      {/* Botón X para cerrar en la esquina superior derecha, siempre visible */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        size="small"
        sx={{
          position: 'fixed',
          right: 10,
          top: 1,
          zIndex: 1300,
          color: 'grey.600',
          background: 'white',
          boxShadow: 1,
          border: '1px solid #ddd',
        }}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>
      {/* Barra de controles de zoom y descarga, separados visualmente */}
      <div
        style={
          user?.role === 'admin'
            ? { display: 'flex', alignItems: 'center', padding: '5px', paddingRight: 56 }
            : { display: 'flex', alignItems: 'center', padding: '5px', justifyContent: 'center' }
        }
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <ZoomOutButton />
          <ZoomPopover />
          <ZoomInButton />
        </div>
        {user?.role === 'admin' && <div style={{ flex: 1 }} />}
        {user?.role === 'admin' && (
          <Tooltip title={t('catalog.card.download', 'Download PDF')} arrow>
            <IconButton component="a" href={fileUrl} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'grey.600', ml: 1 }}>
              <CloudDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div style={{ height: 'calc(95vh - 56px)', overflow: 'auto' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} plugins={[zoomPluginInstance]} onDocumentLoad={handleDocumentLoad} />
        </Worker>
      </div>
    </div>
  );
};

export default PDFPreviewWithZoom;
