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

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { text, action, commentId, setheart: heart, userId, actionheart, emailcomment, profile } = body;

    await connectMongoDB();
    const post = await Post.findById({ _id: id });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const timestamp = new Date().toLocaleString();

    console.log('Request body:', body);
    console.log('Heart value:', heart);
    console.log('userId body:', userId);
    console.log('actionheart body:', actionheart);

    if (heart !== undefined) {
      post.heart = heart;
    }

    if (actionheart === 'like') {
      if (!post.likedByUsers) {
        post.likedByUsers = [];
      }
      if (!post.likedByUsers.includes(userId)) {
        post.likedByUsers.push(userId);
      }
    } else if (actionheart === 'unlike') {
      if (post.likedByUsers) {
        post.likedByUsers = post.likedByUsers.filter((user) => user !== userId);
      }
    }

    try {
      await post.save();
      console.log('Post updated:', post);
    } catch (error) {
      console.error('Error saving post:', error);
    }

    if (action === 'comment') {
      post.comments.push({
        text,
        emailcomment,
        profile: typeof profile === 'string' ? profile : '',
        timestamp,
        replies: [],
      });
    } else if (action === 'reply' && commentId) {
      const comment = post.comments.id(commentId);
      if (comment) {
        comment.replies.push({
          text,
          emailcomment,
          profile: typeof profile === 'string' ? profile : '',
          timestamp,
        });
      }
    }

    await post.save();
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}