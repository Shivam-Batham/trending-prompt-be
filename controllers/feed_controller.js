import Post from "../models/post_model.js";
export async function fetchFeed(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;


    const filters = {
      status: "active",
    //   created_by: req?.user._id,
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
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}