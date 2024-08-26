import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        topic: String,
        course: String,
        description: String,
        file: String,
        heart: Number,
        comment: Object,
    },
    {

        timestamps: true

    }

)

const Post = mongoose.models.Post || mongoose.model("Post",postSchema);
export default Post;