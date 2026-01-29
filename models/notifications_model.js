import mongoose from "mongoose";

const notificationSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  message: String,
  read_by: [
    {
      readerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      read_at: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export default Notification = mongoose.model('Notifications',notificationSchema);
