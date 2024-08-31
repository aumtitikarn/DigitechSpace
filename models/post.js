import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    course: { type: String, required: true },
    description: { type: String, required: true },
    heart: { type: Number, default: 0 },
    imageUrl: { type: [String], required: true }, // Array of strings
    author: { type: String, required: true },
    selectedCategory: {
      type: String,
      enum: [
        'Document',
        'Model/3D',
        'Website',
        'MobileApp',
        'Datasets',
        'AI',
        'IOT',
        'Program',
        'Photo/Art',
        'Other',
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
