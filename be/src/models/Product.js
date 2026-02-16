const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: [true, 'Product name is required'], trim: true },
    receiveCount: { type: Number, default: 0 },
    missing: { type: Number, default: 0 },
    availableCount: { type: Number, default: 0 },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock'],
      default: 'in-stock',
    },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.availableCount <= 0) {
    this.status = 'out-of-stock';
  } else if (this.availableCount <= 10) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
