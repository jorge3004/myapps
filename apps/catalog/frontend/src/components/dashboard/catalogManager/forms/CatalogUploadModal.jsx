import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import CatalogUploadForm from './CatalogUploadForm';
import { useCatalogsContext } from '../../../../context/CatalogsContext';
import { useAuth } from '../../../../context/AuthContext';



const CatalogUploadModal = ({ open, onClose, isMobile }) => {
  const { user } = useAuth();
  const {
    uploading,
    error,
    handleUpload: realHandleUpload,
    fetchCatalogs,
    setError,
  } = useCatalogsContext();

  const [name, setName] = React.useState('');
  const [file, setFile] = React.useState(null);

  // Limpiar estado al abrir/cerrar
  React.useEffect(() => {
    if (open) {
      setName('');
      setFile(null);
      setError && setError('');
    }
  }, [open, setError]);

  const handleUpload = async (e) => {
    e.preventDefault();
    await realHandleUpload(e, name, file);
    // Espera a que uploading sea false y error no exista para cerrar y refrescar
    setTimeout(() => {
      if (!error) {
        setName('');
        setFile(null);
        if (onClose) onClose();
        fetchCatalogs && fetchCatalogs();
      }
    }, 500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        Subir nuevo catálogo PDF
        <IconButton aria-label="cerrar" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CatalogUploadForm
          name={name}
          setName={setName}
          file={file}
          setFile={setFile}
          uploading={uploading}
          error={error}
          handleUpload={handleUpload}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CatalogUploadModal;
