import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    author: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: Number, min: 0, default: null },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);