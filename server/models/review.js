const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema({
  id: {
    type: String,
  },
  owner: {
    type: String,
  },
  content: {
    type: String,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  created_on: {
    type: Number,
    default: Date.now,
  },
});

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
