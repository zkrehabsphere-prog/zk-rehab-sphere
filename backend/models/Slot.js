const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Store date as a Date object (time portion is stripped)
    date: {
      type: String, // e.g. "2025-04-20" store as string for easy filtering
      required: true,
    },
    time: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Compound index to prevent duplicate slots for same doctor at same time
slotSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });
slotSchema.index({ isBooked: 1, date: 1 });

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
