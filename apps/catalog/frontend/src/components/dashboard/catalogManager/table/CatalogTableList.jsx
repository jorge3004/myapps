import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';

const CatalogTableList = ({ catalogs, handlePreview, handleDelete, userRole }) => {
  const { t } = useTranslation();
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 3,
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      <Table
        size="medium"
        sx={{ minWidth: 600, width: '100%', maxWidth: '100%' }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ minWidth: 40, textAlign: 'center', verticalAlign: 'middle' }}>{t('catalog.table.id', 'ID')}</TableCell>
            <TableCell align="center" sx={{ minWidth: 120, p: 1, textAlign: 'center', verticalAlign: 'middle' }}>
              <Box sx={{ width: '100%' }}>{t('catalog.table.name', 'Name')}</Box>
            </TableCell>
            <TableCell align="center" sx={{ minWidth: 100, textAlign: 'center', verticalAlign: 'middle' }}>{t('catalog.table.uploadedBy', 'Uploaded by')}</TableCell>
            <TableCell align="center" sx={{ minWidth: 120, textAlign: 'center', verticalAlign: 'middle' }}>{t('catalog.table.date', 'Date')}</TableCell>
            <TableCell align="center" sx={{ minWidth: 120, width: '200px !important', maxWidth: '200px !important', p: 1, textAlign: 'center', verticalAlign: 'middle' }}>
              {t('catalog.table.actions', 'Actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {catalogs.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell align="center">{cat.id}</TableCell>
              <TableCell align="center" sx={{ wordBreak: 'break-word', maxWidth: 120 }}>
                {cat.name}
              </TableCell>
              <TableCell align="center" sx={{ wordBreak: 'break-word', maxWidth: 100 }}>
                {cat.uploaded_by}
              </TableCell>
              <TableCell align="center" sx={{ wordBreak: 'break-word', maxWidth: 120 }}>
                {new Date(cat.created_at).toLocaleString()}
              </TableCell>
              <TableCell align="center" sx={{ p: 1, width: '200px !important', maxWidth: '200px !important', textAlign: 'center', verticalAlign: 'middle' }}>
                <IconButton onClick={() => handlePreview(cat.url)} title={t('catalog.table.preview', 'Preview PDF')} size="medium" sx={{ m: 0.5 }}>
                  <VisibilityIcon fontSize="medium" />
                </IconButton>
                {userRole === 'admin' && (
                  <>
                    <IconButton component="a" href={cat.url} download title={t('catalog.table.download', 'Download PDF')} size="medium" sx={{ m: 0.5 }}>
                      <CloudDownloadIcon fontSize="medium" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(cat.id)} title={t('catalog.table.delete', 'Delete catalog')} size="medium" sx={{ m: 0.5 }}>
                      <DeleteIcon fontSize="medium" color="error" />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CatalogTableList;
