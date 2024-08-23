import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        report: String,
        email: String,
    },
    {

        timestamps: true

    }

)

const Post = mongoose.models.Postss || mongoose.model("Postss",postSchema);
export default Post;