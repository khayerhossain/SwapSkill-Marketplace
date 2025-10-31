import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "Anonymous" },
  image: { type: String },
  date: { type: Date, default: Date.now },
  source: { type: String, default: "Newsletter Signup" },
});

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);