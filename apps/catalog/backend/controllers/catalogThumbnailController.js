// backend/controllers/catalogThumbnailController.js
// Controlador para generar y servir thumbnails de catálogos PDF
const fs = require('fs');
const os = require('os');
const path = require('path');
const s3 = require('../utils/s3');
const { getCatalogById, updateThumbnailUrl } = require('../models/catalog');
const { generateThumbnail } = require('../utils/pdf');

// Configuración
const BUCKET = process.env.AWS_S3_BUCKET;
const THUMB_WIDTH = 128;
const THUMB_HEIGHT = 180;

/**
 * Endpoint: GET /api/catalogs/:id/thumbnail
 * Genera y devuelve la URL del thumbnail PNG del PDF
 */
exports.getOrCreateThumbnail = async (req, res) => {
  const { id } = req.params;
  try {
    const catalog = await getCatalogById(id);
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });
    if (catalog.thumbnail_url) {
      // Ya existe thumbnail
      return res.json({ success: true, thumbnailUrl: catalog.thumbnail_url });
    }
    // Verificar si ya existe en S3 (por nombre)
    const thumbKey = `thumbnails/catalog_${id}_thumb.png`;
    try {
      await s3.headObject({ Bucket: BUCKET, Key: thumbKey }).promise();
      // Ya existe en S3, construir URL pública
      const url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbKey}`;
      await updateThumbnailUrl(id, url);
      return res.json({ success: true, thumbnailUrl: url });
    } catch (err) {
      // No existe, continuar
    }
    // Descargar PDF temporalmente en /tmp (siempre Linux)
    // Usar rutas absolutas Linux para WSL/producción
    const pdfTmp = `/tmp/catalog_${id}.pdf`;
    const pdfFile = fs.createWriteStream(pdfTmp);
    await new Promise((resolve, reject) => {
      s3.getObject({ Bucket: BUCKET, Key: catalog.s3_key })
        .createReadStream()
        .pipe(pdfFile)
        .on('finish', resolve)
        .on('error', reject);
    });
    // Generar thumbnail
    const thumbTmp = `/tmp/catalog_${id}_thumb.png`;
    await generateThumbnail(pdfTmp, thumbTmp, THUMB_WIDTH, THUMB_HEIGHT);
    // Subir thumbnail a S3
    const thumbBuffer = fs.readFileSync(thumbTmp);
    await s3.putObject({
      Bucket: BUCKET,
      Key: thumbKey,
      Body: thumbBuffer,
      ContentType: 'image/png',
      // ACL: 'public-read', // Comentado porque el bucket no permite ACLs; se recomienda usar políticas de bucket modernas en AWS
    }).promise();
    // Construir URL pública
    const url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbKey}`;
    await updateThumbnailUrl(id, url);
    // Limpiar archivos temporales
    fs.unlinkSync(pdfTmp);
    fs.unlinkSync(thumbTmp);
    res.json({ success: true, thumbnailUrl: url });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate thumbnail', error: err.message });
  }
};
