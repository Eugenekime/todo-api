import mongoose, { type InferSchemaType } from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [300, 'Description must be at most 300 characters'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

TodoSchema.index({ createdAt: -1 });
TodoSchema.index({ completed: 1 });
TodoSchema.index({ dueDate: 1 });

export type TodoFields = InferSchemaType<typeof TodoSchema>;
export default mongoose.model('Todo', TodoSchema);
