const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    description: { type: String, default: '' },
    specifications: { type: Map, of: String, default: {} },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: {
      virtuals: true,
      flattenMaps: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.index({ name: 'text', brand: 'text', categoryName: 'text' });

module.exports = mongoose.model('Product', productSchema);
