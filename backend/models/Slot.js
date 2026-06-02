const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

// Compound index to prevent duplicate slots for same expert at same time
slotSchema.index(
  { expert: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { expert: { $exists: true, $ne: null } } }
);
slotSchema.index({ isBooked: 1, date: 1 });

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
