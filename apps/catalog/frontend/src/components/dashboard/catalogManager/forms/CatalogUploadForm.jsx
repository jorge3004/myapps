import React from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const CatalogUploadForm = ({
  name,
  setName,
  file,
  setFile,
  uploading,
  error,
  handleUpload,
  isMobile
}) => {
  const fileInputRef = React.useRef();
  return (
    <Box
      component="form"
      onSubmit={handleUpload}
      sx={{
        mb: 3,
        display: 'flex',
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <TextField
        label="Nombre del catálogo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
        fullWidth={isMobile}
        InputProps={{
          endAdornment: name ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Limpiar nombre"
                onClick={() => setName('')}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={e => {
          const selected = e.target.files[0];
          setFile(selected);
          // Usar función para obtener el valor más reciente de name
          if (selected) {
            setName(prevName => {
              if (!prevName || prevName === '') {
                return selected.name.replace(/\.pdf$/i, '');
              }
              return prevName;
            });
          }
          // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label htmlFor="pdf-upload" style={{ width: '100%' }}>
          <Button
            variant="outlined"
            color="secondary"
            component="span"
            sx={{
              width: '100%',
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: 2,
              boxShadow: 1,
              textTransform: 'none',
              mb: 1
            }}
          >
            {file ? 'Archivo seleccionado' : 'Elegir archivo PDF'}
          </Button>
        </label>
        <Typography
          variant="body2"
          color={error ? 'error' : 'textSecondary'}
          sx={{ mt: 0.5, minHeight: 24 }}
        >
          {error || (file ? file.name : 'Ningún archivo seleccionado')}
        </Typography>
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={uploading || !file || !name}
        sx={{
          minWidth: 120,
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: 2,
          boxShadow: 1,
          textTransform: 'none',
          alignSelf: { xs: 'stretch', sm: 'center' }
        }}
      >
        {uploading ? 'Subiendo...' : 'Subir PDF'}
      </Button>
    </Box>
  );
};

export default CatalogUploadForm;
