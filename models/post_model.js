import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ai_model: {
      type: String,
    },
    prompt_text: {
      type: String,
      min: [1, "Prompt must be at least 1 character long"],
      max: [1500, "Prompt cannot exceed 1500 character"],
      required: true,
    },
    prompt_description: {
      type: String,
      min: [1, "Prompt description must be at least 1 character long"],
      max: [200, "Prompt description cannot exceed 200 character"],
    },
    raw_image: {
      type: String,
    },
    prompt_image: {
      type: String,
    },
    tags:{
        type:[String],
        index:true,
        default:[]
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    

    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    author:{
      type:String,
    },

    is_featured:{
        type:Boolean,
        default:false
    },

    status:{
        type:String,
        enum:['active','deleted','draft']
    },
    is_verified:Boolean

  },
  {
    timestamps: true,
  },
);

PostSchema.index({
    title:'text',
    tags:'text',
    ai_model:'text'
})

export default mongoose.model("Post",PostSchema);

