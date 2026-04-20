const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['blog', 'pdf', 'clinical-notes'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // For PDF/file resources
    fileUrl: {
      type: String,
      default: '',
    },
    // Cover image path or URL
    coverImage: {
      type: String,
      default: '',
    },
    // For blog posts — HTML or markdown content
    content: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: String,
      trim: true,
      default: 'ZK Rehab Sphere',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
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

resourceSchema.index({ category: 1, isPublished: 1 });
resourceSchema.index({ tags: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
