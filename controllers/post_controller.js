import Post from "../models/post_model.js";
import { cloudinaryFileUpload } from "../utils/cloudinary.js";

export async function createPost(req, res) {
  try {
    const {
      title,
      prompt_text,
      ai_model,
      prompt_description,
      views,
      tags,
      likes,
      is_featured,
      status,
      is_verified,
    } = req.body;

    if (!(title && prompt_text)) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required.",
      });
    }

    const raw_image = req.files?.raw_image?.[0]?.path;
    const prompt_image = req?.files?.prompt_image?.[0]?.path;

    if(!(raw_image && prompt_image)){
      return res.status(400).json({
        success:false,
        message:"raw or prompt image is missing."
      })
    }

    const raw_image_url =  await cloudinaryFileUpload(raw_image);
    const prompt_image_url = await  cloudinaryFileUpload(prompt_image);

    if(!(raw_image_url && prompt_image_url)){
      return res.status(400).json({
        success:false,
        message:"Image Upload failed."
      })
    }
    
    let post = new Post({
      title,
      ai_model,
      prompt_text,
      prompt_description,
      raw_image:raw_image_url.url,
      prompt_image:prompt_image_url.url,
      tags,
      views,
      likes,
      created_by: req?.user?._id,
      author: req?.user?.name,
      is_featured,
      is_verified,
      status,
    });

    post = await post.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error}`,
    });
  }
}

export async function getPost(req, res) {
  try {
    const post_id = req.params.id;

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post found.",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filters = {
      status: "active",
      _id: req?.user._id,
    };

    const [posts, totalPost] = await Promise.all([
      Post.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPost,
      totalPages: Math.ceil(totalPost / limit),
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updatePost(req, res) {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateAllPosts(req, res) {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deletePost(req, res) {
  try {
    const post_id = req.params.id;

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.status = 'deleted';
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteAllPosts(req, res) {
  try {
    const user_id = req.user._id;

    const result = await Post.deleteMany({ created_by: user_id });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found to delete.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
