import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
     
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
)

SessionSchema.index({expiresAt:1}, {expireAfterSeconds:0});

const Session =  mongoose.model("Session", SessionSchema);
export default Session;