const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, trim: true, required: true },
    mimeType: { type: String, trim: true, required: true },
    size: { type: Number, required: true },
    dataUri: { type: String, required: true },
  },
  { _id: false }
);

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: 'General Inquiry',
    },
    preferredContactMethod: {
      type: String,
      enum: ['Call', 'Email', 'WhatsApp', 'Any'],
      default: 'Email',
    },
    appointmentDate: {
      type: Date,
      default: null,
    },
    consent: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      type: attachmentSchema,
      default: null,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'closed'],
      default: 'new',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

contactMessageSchema.index({ status: 1, isRead: 1, createdAt: -1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
module.exports = ContactMessage;
