// backend/routes/catalogs.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const s3 = require('../utils/s3');
const { createCatalog, getAllCatalogs, deleteCatalog } = require('../models/catalog');
const { getOrCreateThumbnail } = require('../controllers/catalogThumbnailController');
// Obtener/generar thumbnail de un catálogo
router.get('/:id/thumbnail', getOrCreateThumbnail);
const { verifyToken, isAdmin } = require('../controllers/user/authController');

const upload = multer({ storage: multer.memoryStorage() });

// Subir PDF a S3 y guardar registro
router.post('/', verifyToken, isAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Archivo PDF requerido' });
    const name = req.body.name || req.file.originalname;
    // Dynamic import for uuid (ESM only)
    const { v4: uuidv4 } = await import('uuid').then(mod => mod);
    const s3_key = `catalogs/${uuidv4()}-${req.file.originalname}`;
    try {
        // Subir a S3
        await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3_key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }).promise();
        // Guardar en BD
        const uploaded_by = req.user.id;
        const id = await createCatalog({ name, s3_key, uploaded_by });
        res.json({ success: true, id, name, s3_key });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al subir PDF', error: err.message });
    }
});

// Listar catálogos (con signed URL)
router.get('/', verifyToken, async (req, res) => {
    try {
        const catalogs = await getAllCatalogs();
        // Generar signed URL para cada PDF
        const result = await Promise.all(catalogs.map(async (cat) => {
            const url = s3.getSignedUrl('getObject', {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: cat.s3_key,
                Expires: 60 * 60 * 24, // 24 horas
            });
            return { ...cat, url };
        }));
        res.json({ success: true, catalogs: result });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al listar catálogos' });
    }
});

// Eliminar catálogo (y archivo en S3)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const cat = await deleteCatalog(req.params.id);
        if (!cat) return res.status(404).json({ success: false, message: 'Catálogo no encontrado' });
        await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: cat.s3_key,
        }).promise();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al eliminar catálogo' });
    }
});

module.exports = router;
