const mongoose = require('mongoose');
const slugify = require('slugify');

const categories = [
  'Back Pain',
  'Sports Injury',
  'Neck Pain',
  'Rehabilitation',
  'Exercise Therapy',
  'Posture Correction',
];

const blogSectionSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  content: { type: String, trim: true },
  image: { type: String, default: '' },
});

const faqSchema = new mongoose.Schema({
  question: { type: String, trim: true },
  answer: { type: String, trim: true },
});

const ctaSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  buttonType: { type: String, enum: ['appointment', 'whatsapp', 'contact', 'custom'], default: 'appointment' },
  buttonText: { type: String, trim: true, default: 'Book Appointment' },
  buttonUrl: { type: String, trim: true, default: '' },
});

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String, // HTML content
      required: true,
    },
    coverImage: {
      type: String, // Base64, URL, or path
      default: '',
    },
    gallery: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: categories,
      default: 'Rehabilitation',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      name: { type: String, default: 'ZK Rehab Sphere' },
      qualification: { type: String, default: 'PT' },
      designation: { type: String, default: 'Rehabilitation Specialist' },
      image: { type: String, default: '' },
      role: { type: String, default: 'Medical Team' },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    seoTitle: { type: String, trim: true, default: '' },
    seoDescription: { type: String, trim: true, default: '' },
    seoKeywords: [{ type: String, trim: true }],
    focusKeyword: { type: String, trim: true, default: '' },
    ogImage: { type: String, trim: true, default: '' },
    sections: [blogSectionSchema],
    keyTakeaways: [{ type: String, trim: true }],
    faqs: [faqSchema],
    cta: { type: ctaSchema, default: () => ({}) },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

function computeReadTime(content = '', sections = []) {
  const text = [content, ...sections.map(s => s.content || '')].join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

blogPostSchema.pre('validate', async function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.slug || this.title, { lower: true, strict: true });
  }

  this.readTime = computeReadTime(this.content, this.sections);

  next();
});

blogPostSchema.pre('save', async function (next) {
  if (!this.isModified('slug')) return next();

  const BlogPost = this.constructor;
  let slugCandidate = this.slug;
  let suffix = 0;

  while (true) {
    const existing = await BlogPost.findOne({ slug: slugCandidate, _id: { $ne: this._id } });
    if (!existing) break;
    suffix += 1;
    slugCandidate = `${this.slug}-${suffix}`;
  }

  this.slug = slugCandidate;
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
