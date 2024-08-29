import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        topic: String,
        course: String,
        description: String,
        heart: Number,
        comment: Object,
        name: { type: String },
        imageUrl: { type: String },
    },
    {

        timestamps: true

    }

)

const Post = mongoose.models.Post || mongoose.model("Post",postSchema);
export default Post;