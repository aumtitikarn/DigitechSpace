import mongoose from "mongoose";
import { type } from "os";

const replySchema = new mongoose.Schema({
  text: String,
  emailcomment: String,
  // author: String,
  // profile: { type: [String], required: true },
  timestamp: String, // เพิ่ม timestamp
});

// สร้าง schema สำหรับ comment
const commentSchema = new mongoose.Schema({
  text: String,
  emailcomment: String,
  // author: String,
  timestamp: String, // เพิ่ม timestamp
  // profile: { type: [String], required: true },
  replies: [replySchema],
});

// สร้าง schema สำหรับ post
const postSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    course: { type: String, required: true },
    description: { type: String, required: true },
    heart: { type: Number, default: 0 },
    imageUrl: { type: [String], required: true }, // Arraystrings
    userprofileid: { type: [String], required: true },
    // userprofile: { type: [String], required: true },
    // author: { type: String, required: true },
    email: { type: String, required: true },
    comments: { type: [commentSchema], default: [] },
    likedByUsers: {
      type: [String],
      required: true,
    },
    selectedCategory: {
      type: String,
      enum: [
        'academic',
        'social',
        'finance',
        'accommodation',
        'foodHealth',
        'events',
        'relationships',
        'technology',
        'lifestyle',
        'career',
        'portfolio',
        'other',
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
