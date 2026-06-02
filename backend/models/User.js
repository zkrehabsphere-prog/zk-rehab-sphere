const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    profileTitle: {
      type: String,
      trim: true,
      default: '',
    },
    profileTag: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: false,
      sparse: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },
    dob: {
      type: Date,
      default: null,
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: '',
    },
    qualification: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    specialization: {
      type: String,
      trim: true,
      default: '',
    },
    languages: [{ type: String, trim: true }],
    city: {
      type: String,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: '',
    },
    clinicName: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    position: {
      type: String,
      trim: true,
      default: '',
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'expert', 'patient'],
      default: 'patient',
      trim: true,
      lowercase: true,
    },
    expertiseAreas: [{ type: String, trim: true }],
    socialLinks: {
      linkedIn: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    preferences: {
      darkMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      appointmentAlerts: { type: Boolean, default: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    age: {
      type: Number,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    // For doctor profiles — links to Expert document
    expertProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.firebaseUid; // Don't expose internal UID in responses
        return ret;
      },
    },
  }
);

// Index for fast lookups
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
