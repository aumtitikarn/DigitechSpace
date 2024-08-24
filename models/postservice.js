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

const Post = mongoose.models.PostSer || mongoose.model("PostSer",postSchema);
export default Post;