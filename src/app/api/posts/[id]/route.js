import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/post";
import NormalUser from "../../../../../models/NormalUser";
import StudentUser from "../../../../../models/StudentUser";
import { NextResponse } from "next/server";

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const postblog = await Post.findOne({ _id: id });

  if (!postblog) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  // Loop through comments and replies to access emailcomment
  const commentsWithReplies = await Promise.all(postblog.comments.map(async (comment) => {
    // Process replies
    const repliesWithEmail = await Promise.all(comment.replies.map(async (reply) => {
      // Find user associated with reply emailcomment
      let studentusercommentreply = await StudentUser.findOne({ email: reply.emailcomment }, 'name imageUrl').lean();
      let normalusercommentreply = await NormalUser.findOne({ email: reply.emailcomment }, 'name imageUrl').lean();
      let usercommentreply = studentusercommentreply || normalusercommentreply;

      let commentProfileImageSourcereply = null;
      let commentUserNamereply = 'Unknown User';  // Default user name

      if (usercommentreply) {
        console.log(`Found user: ${usercommentreply.name}`);
        console.log(`ProfileImg: ${usercommentreply.imageUrl}`);
        commentUserNamereply = usercommentreply.name;

        // Determine profile image source for the reply
        if (isValidHttpUrl(usercommentreply.imageUrl)) {
          commentProfileImageSourcereply = getProxyUrl(usercommentreply.imageUrl);
        } else {
          commentProfileImageSourcereply = `/api/posts/images/${usercommentreply.imageUrl}`;
        }
      } else {
        console.log('User not found in both StudentUser and NormalUser collections for reply');
      }

      return {
        text: reply.text,
        emailcomment: reply.emailcomment,
        userName: commentUserNamereply,
        profileImageSource: commentProfileImageSourcereply,
        timestamp: reply.timestamp,
        _id: reply._id
      };
    }));

    // Find user associated with comment emailcomment
    let studentusercomment = await StudentUser.findOne({ email: comment.emailcomment }, 'name imageUrl').lean();
    let normalusercomment = await NormalUser.findOne({ email: comment.emailcomment }, 'name imageUrl').lean();
    let usercomment = studentusercomment || normalusercomment;

    let commentProfileImageSource = null;
    let commentUserName = 'Unknown User';  // Default user name

    if (usercomment) {
      console.log(`Found user: ${usercomment.name}`);
      console.log(`ProfileImg: ${usercomment.imageUrl}`);
      commentUserName = usercomment.name;

      // Determine profile image source for the comment
      if (isValidHttpUrl(usercomment.imageUrl)) {
        commentProfileImageSource = getProxyUrl(usercomment.imageUrl);
      } else {
        commentProfileImageSource = `/api/posts/images/${usercomment.imageUrl}`;
      }
    } else {
      console.log('User not found in both StudentUser and NormalUser collections for comment');
    }

    return {
      text: comment.text,
      emailcomment: comment.emailcomment,
      timestamp: comment.timestamp,
      userName: commentUserName,
      profileImageSource: commentProfileImageSource,
      replies: repliesWithEmail,  // Include processed replies
      _id: comment._id
    };
  }));

  // Find the user associated with the blog post
  let studentuser = await StudentUser.findOne({ email: postblog.email }, 'name imageUrl').lean();
  let normaluser = await NormalUser.findOne({ email: postblog.email }, 'name imageUrl').lean();
  let user = studentuser || normaluser;

  let authorProfileImageSource = null;
  if (user) {
    console.log(`Found user: ${user.name}`);
    console.log(`ProfileImg: ${user.imageUrl}`);

    // Determine profile image source for the author
    if (isValidHttpUrl(user.imageUrl)) {
      authorProfileImageSource = getProxyUrl(user.imageUrl);
    } else {
      authorProfileImageSource = `/api/posts/images/${user.imageUrl}`;
    }
  } else {
    console.log('User not found in both StudentUser and NormalUser collections');
  }

  // Return the blog post with the author's information and comments with replies
  const post = {
    ...postblog.toObject(),
    authorName: user ? user.name : 'Unknown Author',
    profileImage: authorProfileImageSource,
    comments: commentsWithReplies,  // Include comments with emailcomment and replies
  };

  return NextResponse.json({ post }, { status: 200 });
}

// export async function PUT(req, { params }) {
//   try {
//     const { id } = params;
//     const body = await req.json();
//     const { text, action, commentId, setheart: heart, userId, actionheart, emailcomment, profile, newTopic:topic, newCourse:course, newDescription:description, newSelectedCategory:selectedCategory} = body;
//     // const { newTopic:topic, newCourse:course, newDescription:description, newSelectedCategory:selectedCategory} = await req.json();

//     await connectMongoDB();
//     const post = await Post.findById({ _id: id });

//     if (!post) {
//       return NextResponse.json({ message: 'Post not found' }, { status: 404 });
//     }

//     const updated = await Post.findByIdAndUpdate(id,{topic, course, description, selectedCategory});

//     const timestamp = new Date().toLocaleString();

//     console.log('Request body:', body);
//     console.log('Heart value:', heart);
//     console.log('userId body:', userId);
//     console.log('actionheart body:', actionheart);

//     if (heart !== undefined) {
//       post.heart = heart;
//     }

//     if (actionheart === 'like') {
//       if (!post.likedByUsers) {
//         post.likedByUsers = [];
//       }
//       if (!post.likedByUsers.includes(userId)) {
//         post.likedByUsers.push(userId);
//       }
//     } else if (actionheart === 'unlike') {
//       if (post.likedByUsers) {
//         post.likedByUsers = post.likedByUsers.filter((user) => user !== userId);
//       }
//     }

//     try {
//       await post.save();
//       console.log('Post updated:', post);
//     } catch (error) {
//       console.error('Error saving post:', error);
//     }

//     if (action === 'comment') {
//       post.comments.push({
//         text,
//         emailcomment,
//         profile: typeof profile === 'string' ? profile : '',
//         timestamp,
//         replies: [],
//       });
//     } else if (action === 'reply' && commentId) {
//       const comment = post.comments.id(commentId);
//       if (comment) {
//         comment.replies.push({
//           text,
//           emailcomment,
//           profile: typeof profile === 'string' ? profile : '',
//           timestamp,
//         });
//       }
//     }

//     await post.save();
//     return NextResponse.json({ post,updated }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating post:', error);
//     return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
//   }
// }

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Error parsing JSON:", err.message);
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    // Destructure and initialize variables
    let {
      text,
      action,
      commentId,
      setheart: heart,
      userId,
      actionheart,
      emailcomment,
      profile,
      newTopic: topic,
      newCourse: course,
      newDescription: description,
      newSelectedCategory: selectedCategory,
      img: imageUrl = [], // Ensure this is an array
    } = body;

    // Connect to MongoDB
    await connectMongoDB();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Handle form data if multipart/form-data is received
    const contentType = req.headers.get("content-type");
    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Use a temporary object to handle updates
      const updates = { topic, course, description, selectedCategory };

      for (const [key, value] of formData.entries()) {
        switch (key) {
          case "topic":
            updates.topic = value.toString();
            break;
          case "course":
            updates.course = value.toString();
            break;
          case "description":
            updates.description = value.toString();
            break;
          case "selectedCategory":
            updates.selectedCategory = value.toString();
            break;
          case "imageUrl":
            if (value instanceof Blob && value.type.startsWith("image/")) {
              const imageName = `${Date.now()}_${value.name}`;
              const buffer = Buffer.from(await value.arrayBuffer());
              const stream = Readable.from(buffer);
              const uploadStream = imgbucket.openUploadStream(imageName);
              await new Promise((resolve, reject) => {
                stream.pipe(uploadStream).on("finish", resolve).on("error", reject);
              });
              imageUrl.push(imageName); // Add only the image name as a string
            }
            break;
        }
      }

      // Update variables with the processed values
      ({ topic, course, description, selectedCategory } = updates);
    }

    // Validate imageUrl to ensure it's an array of strings
    imageUrl = imageUrl.filter((img) => typeof img === "string");

    // Build update data
    const updateData = {
      ...(topic && { topic }),
      ...(course && { course }),
      ...(description && { description }),
      ...(selectedCategory && { selectedCategory }),
      ...(imageUrl.length > 0 && { imageUrl }), // Only add imageUrl if it's valid
    };

    // Update the main post fields
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, strict: false }
    );

    // Update likes and comments
    if (heart !== undefined) {
      post.heart = heart;
    }

    if (actionheart === "like") {
      if (!post.likedByUsers.includes(userId)) {
        post.likedByUsers.push(userId);
      }
    } else if (actionheart === "unlike") {
      post.likedByUsers = post.likedByUsers.filter((user) => user !== userId);
    }

    if (action === "comment") {
      post.comments.push({
        text,
        emailcomment,
        profile,
        timestamp: new Date().toLocaleString(),
        replies: [],
      });
    } else if (action === "reply" && commentId) {
      const comment = post.comments.id(commentId);
      if (comment) {
        comment.replies.push({
          text,
          emailcomment,
          profile,
          timestamp: new Date().toLocaleString(),
        });
      }
    }

    await post.save();

    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json(); // Assume the id of the report is sent in the request body
    const { client, imgbucket, filebucket } = await connectMongoDB();

    if (!id) {
      return NextResponse.json({ msg: "ID is required" }, { status: 400 });
    }

    const deletedpost = await Post.findByIdAndDelete(id);

    if (deletedpost.imageUrl && deletedpost.imageUrl.length > 0) {
      for (const imageName of deletedpost.imageUrl) {
        const image = await imgbucket.find({ filename: imageName }).toArray();
        
        if (image.length > 0) {
          const imageId = image[0]._id;

          // Delete image from images and chunks collection
          await imgbucket.delete(imageId);
          await client.collection('images.chunks').deleteMany({ files_id: imageId });
        }
      }
    }

    if (!deletedpost) {
      return NextResponse.json({ msg: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { msg: "Error deleting report" },
      { status: 500 }
    );
  }
}