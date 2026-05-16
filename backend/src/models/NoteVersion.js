import mongoose from 'mongoose';

const noteVersionSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeType: {
      type: String,
      enum: ['create', 'update', 'restore'],
      default: 'update',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

noteVersionSchema.index({ noteId: 1, versionNumber: -1 });
noteVersionSchema.index({ noteId: 1, createdAt: -1 });

const NoteVersion = mongoose.model('NoteVersion', noteVersionSchema);
export default NoteVersion;
