const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = Schema({
  id: {
    type: String,
    index: true,
  },
  title: {
    type: String,
    index: true,
  },
  poster_path: {
    type: String,
  },
  owner: {
    type: String,
  },
  content: {
    type: String,
  },
  hearts: {
    type: [String],
    default: [],
  },
  created_on: {
    type: Number,
    default: Date.now,
  },
});

ReviewSchema.index({ title: "text", content: "text" });

const ReviewModel = mongoose.model("Review", ReviewSchema);

module.exports = ReviewModel;
