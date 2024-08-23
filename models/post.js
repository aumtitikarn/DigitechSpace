import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        report: String,
        email: String,
        description: String
    },
    {

        timestamps: true

    }

)

const Post = mongoose.models.Post || mongoose.model("Post",postSchema);
export default Post;