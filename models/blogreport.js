import mongoose,{ Schema } from "mongoose";

const PostBlogSchema = new Schema(
    {
        blogname: { type: String, required: true },
        report: { type: String, required: true },
        author: { type: String, required: true },
        blogid: { type: String, required: true },
        selectedReason: {
            type: String,
            enum: [
              'มีคำไม่สุภาพ หรือ คำหยาบคาย',
              'เนื้อหาไม่ตรงกับหัวข้อ',
              'มีการโฆษณาสิ่งผิดกฎหมาย, เว็บพนัน, แชร์ลูกโซ่',
              'บทความไม่เกี่ยวข้องกับวิชาเรียน หรือมหาวิทยลัย',
              'อื่นๆ',
            ],
            required: true,
          },
    },
    {

        timestamps: true

    }

)

const PostBlog = mongoose.models.PostBlog || mongoose.model("PostBlog",PostBlogSchema);
export default PostBlog;