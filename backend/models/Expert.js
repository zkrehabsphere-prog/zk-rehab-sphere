const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true, // e.g. "Senior Physiotherapist"
    },
    degree: {
      type: String,
      required: true,
      trim: true, // e.g. "BPT"
    },
    experience: {
      type: String,
      required: true,
      trim: true, // e.g. "3+ Years Experience"
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    // Image: path relative to /uploads or an external URL
    image: {
      type: String,
      default: '',
    },
    // Optional: link to a User account (for doctor login)
    linkedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Display order on the Experts page
    order: {
      type: Number,
      default: 0,
    },
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    socialLinks: {
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
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

expertSchema.index({ isActive: 1, order: 1 });

const Expert = mongoose.model('Expert', expertSchema);
module.exports = Expert;
