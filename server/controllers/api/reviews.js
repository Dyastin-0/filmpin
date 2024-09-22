const Reviews = require("../../models/review");

const handlePostReview = async (req, res) => {
  const { id, title, content } = req.body;
  const { id: user_id } = req;

  if (!id) return res.status(400).json({ message: "Missing ID." });
  if (!title) return res.status(400).json({ message: "Missing title." });
  if (!content) return res.status(400).json({ message: "Missing content." });
  if (!user_id) return res.status(400).json({ message: "Missing user ID." });

  try {
    const newReview = await Reviews.create({
      id,
      title,
      owner: user_id,
      content,
    });

    res.json({ message: "Review posted.", newReview });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const handleGetReview = async (req, res) => {
  const { id, title, page } = req.query;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (!id) return res.status(400).json({ message: "Missing ID." });
  if (!title) return res.status(400).json({ message: "Missing title." });

  try {
    const reviews = await Reviews.find({ id: id }).skip(skip).limit(limit);

    const total = await Reviews.countDocuments({ id, title });
    const total_pages = Math.ceil(total / limit);

    res.json({
      reviews,
      current_page: page,
      total_pages,
      total_reviews: total,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const handleLike = async (req, res) => {
  const { id, title } = req.query;
  const { id: user_id } = req;

  if (!id) return res.status(400).json({ message: "Missing ID." });
  if (!title) return res.status(400).json({ message: "Missing title." });

  try {
    const review = await Reviews.findOne({ id: id, title: title });
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.owner === user_id)
      return res
        .status(400)
        .json({ message: "You can't heart your own review." });

    const hasLiked = review.hearts.includes(user_id);

    if (hasLiked) {
      review.hearts.pull(user_id);
    } else {
      review.hearts.push(user_id);
    }

    await review.save();

    res.json({
      message: hasLiked ? "Review unliked." : "Review liked.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating like status", error });
  }
};

module.exports = {
  handleGetReview,
  handlePostReview,
  handleLike,
};
