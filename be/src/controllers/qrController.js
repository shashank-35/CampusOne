const { generateQR } = require('../services/qrService');
const config = require('../config/config');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Generate QR code for the public inquiry form
// @route   GET /api/qr/inquiry-form
const generateInquiryQR = asyncHandler(async (req, res) => {
  const url = `${config.clientUrl}/inquiry-form`;
  const qrDataUrl = await generateQR(url);

  ApiResponse.success(res, 'QR code generated', { qrDataUrl, url });
});

module.exports = { generateInquiryQR };
