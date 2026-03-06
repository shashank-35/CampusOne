const QRCode = require('qrcode');

/**
 * Generate a QR code data URL for the given URL string
 * @param {string} url - The URL to encode
 * @returns {Promise<string>} Base64 data URL (image/png)
 */
const generateQR = async (url) => {
  return await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: { dark: '#1e293b', light: '#ffffff' },
  });
};

module.exports = { generateQR };
