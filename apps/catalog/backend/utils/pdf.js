// backend/utils/pdf.js
// Utilidad para generar thumbnails de PDFs usando Poppler (pdftoppm)
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Genera un thumbnail PNG de la primera página de un PDF.
 * @param {string} pdfPath - Ruta local al PDF.
 * @param {string} outputPath - Ruta donde guardar el PNG generado.
 * @param {number} width - Ancho del thumbnail (px).
 * @param {number} height - Alto del thumbnail (px).
 * @returns {Promise<string>} - Resolución con la ruta del PNG generado.
 */
function generateThumbnail(pdfPath, outputPath, width = 128, height = 180) {
  return new Promise((resolve, reject) => {
    // pdftoppm -f 1 -singlefile -scale-to-x WIDTH -scale-to-y HEIGHT -png input.pdf output
    const args = [
      '-f', '1',
      '-singlefile',
      '-scale-to-x', width.toString(),
      '-scale-to-y', height.toString(),
      '-png',
      pdfPath,
      outputPath.replace(/\.png$/, '') // pdftoppm agrega .png
    ];
    const proc = spawn('pdftoppm', args);
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error('pdftoppm failed with code ' + code));
      }
    });
  });
}

module.exports = { generateThumbnail };