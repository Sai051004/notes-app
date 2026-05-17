import mongoose from 'mongoose';
import { PERMISSIONS } from '../constants/index.js';

const sharedWithSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: String,
      enum: Object.values(PERMISSIONS),
      default: PERMISSIONS.READ,
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [50000, 'Content cannot exceed 50000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sharedWith: [sharedWithSchema],
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 20,
        message: 'Cannot have more than 20 tags',
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    versionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ owner: 1, isArchived: 1, updatedAt: -1 });
noteSchema.index({ 'sharedWith.user': 1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);
export default Note;
