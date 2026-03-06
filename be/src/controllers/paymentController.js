const PDFDocument = require('pdfkit');
const Payment   = require('../models/Payment');
const Admission = require('../models/Admission');
const Student   = require('../models/Student');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────

// @desc  Get all payments (filters + pagination)
// @route GET /api/payments
const getPayments = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;
  const sort  = req.query.sort || '-paymentDate';

  const filter = {};
  if (req.query.status)        filter.status        = req.query.status;
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.studentId)     filter.studentId     = req.query.studentId;
  if (req.query.admissionId)   filter.admissionId   = req.query.admissionId;
  if (req.query.search) {
    const re = new RegExp(req.query.search, 'i');
    filter.$or = [
      { studentName: re },
      { courseName:  re },
      { email:       re },
      { receiptNumber: re },
      { transactionId: re },
    ];
  }
  if (req.query.from || req.query.to) {
    filter.paymentDate = {};
    if (req.query.from) filter.paymentDate.$gte = new Date(req.query.from);
    if (req.query.to)   filter.paymentDate.$lte = new Date(new Date(req.query.to).setHours(23, 59, 59));
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('studentId',   'firstName lastName')
      .populate('admissionId', 'batch status')
      .populate('createdBy',   'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);

  ApiResponse.success(res, 'Payments retrieved', payments, 200, {
    page, limit, total, pages: Math.ceil(total / limit),
  });
});

// @desc  Get single payment
// @route GET /api/payments/:id
const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('studentId',   'firstName lastName email mobileNumber')
    .populate('admissionId', 'batch status courseName totalFees')
    .populate('createdBy',   'firstName lastName');

  if (!payment) throw new ApiError(404, 'Payment not found');
  ApiResponse.success(res, 'Payment retrieved', payment);
});

// @desc  Create payment
// @route POST /api/payments
const createPayment = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  body.createdBy = req.user._id;

  // Auto-fill from admission if admissionId provided
  if (body.admissionId && !body.studentName) {
    const admission = await Admission.findById(body.admissionId);
    if (admission) {
      body.studentName = body.studentName || admission.studentName;
      body.courseName  = body.courseName  || admission.courseName;
      body.email       = body.email       || admission.email;
      body.mobile      = body.mobile      || admission.mobile;
      body.totalFees   = body.totalFees   !== undefined ? body.totalFees : admission.finalFees;
      body.studentId   = body.studentId   || admission.studentId;
    }
  }

  const payment = await Payment.create(body);

  // If payment covers the full fee, update admission paymentStatus
  if (payment.admissionId && payment.status === 'paid') {
    await Admission.findByIdAndUpdate(payment.admissionId, { paymentStatus: 'paid' });
  } else if (payment.admissionId && payment.status === 'partial') {
    await Admission.findByIdAndUpdate(payment.admissionId, { paymentStatus: 'partial' });
  }

  await payment.populate('admissionId', 'batch courseName');
  ApiResponse.success(res, 'Payment recorded successfully', payment, 201);
});

// @desc  Update payment
// @route PUT /api/payments/:id
const updatePayment = asyncHandler(async (req, res) => {
  const existing = await Payment.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Payment not found');

  // Merge and re-compute
  const updates = { ...req.body };
  const totalFees  = updates.totalFees  !== undefined ? Number(updates.totalFees)  : existing.totalFees;
  const paidAmount = updates.paidAmount !== undefined ? Number(updates.paidAmount) : existing.paidAmount;

  updates.remainingAmount = Math.max(0, totalFees - paidAmount);
  if (paidAmount <= 0)               updates.status = 'pending';
  else if (paidAmount >= totalFees)  updates.status = 'paid';
  else                               updates.status = 'partial';

  const payment = await Payment.findByIdAndUpdate(req.params.id, updates, {
    new: true, runValidators: true,
  })
    .populate('studentId',   'firstName lastName')
    .populate('admissionId', 'batch courseName');

  // Sync admission payment status
  if (payment.admissionId) {
    await Admission.findByIdAndUpdate(
      payment.admissionId._id || payment.admissionId,
      { paymentStatus: payment.status }
    );
  }

  ApiResponse.success(res, 'Payment updated successfully', payment);
});

// @desc  Delete payment
// @route DELETE /api/payments/:id
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new ApiError(404, 'Payment not found');
  await payment.deleteOne();
  ApiResponse.success(res, 'Payment deleted successfully');
});

// ─────────────────────────────────────────────
// PDF RECEIPT
// ─────────────────────────────────────────────

// @desc  Download PDF receipt
// @route GET /api/payments/:id/receipt
const downloadReceipt = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('studentId',   'firstName lastName email mobileNumber')
    .populate('admissionId', 'batch courseName');

  if (!payment) throw new ApiError(404, 'Payment not found');

  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="receipt-${payment.receiptNumber}.pdf"`
  );
  doc.pipe(res);

  // ── Color palette ──
  const DARK   = '#1e293b';
  const ACCENT = '#3b82f6';
  const LIGHT  = '#f8fafc';
  const GRAY   = '#64748b';
  const GREEN  = '#16a34a';
  const RED    = '#dc2626';

  // ── Header band ──
  doc.rect(0, 0, doc.page.width, 100).fill(DARK);

  doc
    .font('Helvetica-Bold')
    .fontSize(28)
    .fillColor('#ffffff')
    .text('CampusOne', 50, 28);

  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor('#94a3b8')
    .text('Campus Management System', 50, 62);

  // Receipt title on right
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor('#ffffff')
    .text('FEE RECEIPT', 0, 35, { align: 'right', width: doc.page.width - 50 });

  // ── Receipt meta block ──
  const metaY = 120;
  doc
    .rect(50, metaY, doc.page.width - 100, 64)
    .fill(LIGHT)
    .stroke('#e2e8f0');

  doc.font('Helvetica-Bold').fontSize(9).fillColor(GRAY);
  doc.text('RECEIPT NO.',      70, metaY + 12);
  doc.text('DATE',             240, metaY + 12);
  doc.text('PAYMENT METHOD',   370, metaY + 12);
  doc.text('STATUS',           500, metaY + 12);

  doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK);
  doc.text(payment.receiptNumber,  70, metaY + 28);
  doc.text(
    new Date(payment.paymentDate).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    240, metaY + 28
  );
  doc.text(payment.paymentMethod.toUpperCase(), 370, metaY + 28);

  // Status pill color
  const statusColor = payment.status === 'paid' ? GREEN : payment.status === 'partial' ? '#d97706' : RED;
  doc.font('Helvetica-Bold').fontSize(11).fillColor(statusColor)
    .text(payment.status.toUpperCase(), 500, metaY + 28);

  // ── Section: Student Details ──
  const s1Y = metaY + 84;
  doc.font('Helvetica-Bold').fontSize(12).fillColor(ACCENT)
    .text('STUDENT DETAILS', 50, s1Y);
  doc.moveTo(50, s1Y + 16).lineTo(doc.page.width - 50, s1Y + 16).stroke('#e2e8f0');

  const studentName = payment.studentId
    ? `${payment.studentId.firstName} ${payment.studentId.lastName}`
    : payment.studentName;
  const studentEmail  = payment.studentId?.email  || payment.email  || '—';
  const studentMobile = payment.studentId?.mobileNumber || payment.mobile || '—';
  const courseName    = payment.admissionId?.courseName || payment.courseName || '—';
  const batch         = payment.admissionId?.batch || '—';

  const row = (label, value, x, y) => {
    doc.font('Helvetica').fontSize(9).fillColor(GRAY).text(label, x, y);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK).text(value, x, y + 13);
  };

  row('Student Name', studentName,   50,  s1Y + 26);
  row('Email',        studentEmail,  240, s1Y + 26);
  row('Mobile',       studentMobile, 400, s1Y + 26);
  row('Course',       courseName,    50,  s1Y + 60);
  row('Batch',        batch,         240, s1Y + 60);
  if (payment.transactionId) {
    row('Transaction ID', payment.transactionId, 400, s1Y + 60);
  }

  // ── Section: Fee Summary ──
  const s2Y = s1Y + 110;
  doc.font('Helvetica-Bold').fontSize(12).fillColor(ACCENT)
    .text('FEE SUMMARY', 50, s2Y);
  doc.moveTo(50, s2Y + 16).lineTo(doc.page.width - 50, s2Y + 16).stroke('#e2e8f0');

  // Summary table
  const tableX  = 50;
  const tableW  = doc.page.width - 100;
  const rowH    = 32;
  const col1    = tableX;
  const col2    = tableX + tableW - 140;

  const drawTableRow = (label, value, y, bg, bold) => {
    doc.rect(tableX, y, tableW, rowH).fill(bg);
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(10).fillColor(DARK)
      .text(label, col1 + 12, y + 10);
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(10).fillColor(DARK)
      .text(value, col2, y + 10, { width: 130, align: 'right' });
  };

  let ty = s2Y + 26;
  drawTableRow('Total Course Fees',  `₹ ${payment.totalFees.toLocaleString('en-IN')}`,        ty,       LIGHT,   false);
  ty += rowH;
  drawTableRow('Amount Paid',        `₹ ${payment.paidAmount.toLocaleString('en-IN')}`,       ty,       '#f0fdf4', false);
  ty += rowH;
  drawTableRow('Remaining Amount',   `₹ ${payment.remainingAmount.toLocaleString('en-IN')}`, ty,       '#fff7ed', false);
  ty += rowH;

  // Final row (bold, dark bg)
  doc.rect(tableX, ty, tableW, rowH + 4).fill(DARK);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff')
    .text('Payment Status', col1 + 12, ty + 11);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(statusColor)
    .text(payment.status.toUpperCase(), col2, ty + 11, { width: 130, align: 'right' });

  // ── Notes ──
  if (payment.notes) {
    const notesY = ty + rowH + 24;
    doc.font('Helvetica-Bold').fontSize(10).fillColor(GRAY).text('Notes:', 50, notesY);
    doc.font('Helvetica').fontSize(10).fillColor(DARK)
      .text(payment.notes, 50, notesY + 15, { width: tableW });
  }

  // ── Footer ──
  const footerY = doc.page.height - 80;
  doc.rect(0, footerY, doc.page.width, 80).fill(DARK);
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#94a3b8')
    .text(
      'This is a computer-generated receipt and does not require a signature.',
      50, footerY + 16,
      { align: 'center', width: doc.page.width - 100 }
    )
    .text(
      `Generated on ${new Date().toLocaleString('en-IN')} · CampusOne © ${new Date().getFullYear()}`,
      50, footerY + 34,
      { align: 'center', width: doc.page.width - 100 }
    );

  doc.end();
});

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  downloadReceipt,
};
