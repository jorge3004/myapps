import React from 'react';
import CatalogCard from './CatalogCard';
import { Box } from '@mui/material';

const CatalogCardList = ({ catalogs, onPreview, onDownload, onDelete, userRole }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
    gap: 1.5,
    width: '100%',
    mt: 1,
  }}>
    {catalogs.map((cat) => (
      <CatalogCard
        key={cat.id}
        catalog={cat}
        onPreview={onPreview}
        onDownload={onDownload}
        onDelete={onDelete}
        userRole={userRole}
      />
    ))}
  </Box>
);

export default CatalogCardList;
