import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    category: { type: String, enum: ['logo', 'favicon', 'document', 'image', 'other'] },
  },
  { _id: false }
);

const clientRequestSchema = new mongoose.Schema(
  {
    organization: {
      name: { type: String, required: true, trim: true },
      businessType: { type: String, required: true },
      industry: { type: String, required: true },
      ownerName: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      mobile: { type: String, required: true },
      whatsapp: String,
      address: String,
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
    },
    requirements: {
      websiteCategory: { type: String, required: true },
      purpose: { type: String, required: true },
      numberOfPages: { type: String, required: true },
      features: [String],
      designPreferences: String,
      referenceWebsites: [String],
      domainRequired: { type: Boolean, default: false },
      hostingRequired: { type: Boolean, default: true },
      seoRequired: { type: Boolean, default: false },
      budget: { type: String, required: true },
      deadline: String,
      additionalNotes: String,
    },
    files: [fileSchema],
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    estimatedRevenue: { type: Number, default: 0 },
    serviceType: { type: String, default: 'Website Development' },
  },
  { timestamps: true }
);

clientRequestSchema.index({ 'organization.name': 'text', 'organization.email': 'text', 'organization.ownerName': 'text' });

export default mongoose.model('ClientRequest', clientRequestSchema);
