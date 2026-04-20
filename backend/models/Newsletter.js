const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
    // Unique token for unsubscribe link
    unsubscribeToken: {
      type: String,
      default: () => require('crypto').randomBytes(32).toString('hex'),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.unsubscribeToken; // Don't expose token in list views
        return ret;
      },
    },
  }
);

newsletterSchema.index({ isActive: 1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
module.exports = Newsletter;
