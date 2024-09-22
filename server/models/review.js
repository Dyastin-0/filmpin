const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema({
  id: {
    type: String,
    index: true,
  },
  title: {
    type: String,
    index: true,
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

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
