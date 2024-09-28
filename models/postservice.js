import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        report: String,
        email: String,
        username: String,  // แก้เป็น String
    },
    {
        timestamps: true
    }
);

// ตรวจสอบโมเดลว่ามีอยู่แล้วหรือไม่ มิฉะนั้นสร้างใหม่
const Post = mongoose.models.PostSer || mongoose.model("PostSer", postSchema);
export default Post;
