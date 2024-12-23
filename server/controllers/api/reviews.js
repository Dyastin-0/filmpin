const Reviews = require("../../models/review");
const Users = require("../../models/user");

/**
 * Handles posting a review.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing review details.
 * @param {String} req.body.id - The ID of the reviewed item.
 * @param {String} req.body.title - The title of the reviewed item.
 * @param {String} req.body.content - The content of the review.
 * @param {String} req.id - The ID of the authenticated user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object with a message and the new review.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handlePostReview = async (req, res) => {
  const { id, title, poster_path, content } = req.body;
  const { id: user_id } = req;

  if (!id) return res.status(400).json({ message: "Missing ID." });
  if (!title) return res.status(400).json({ message: "Missing title." });
  if (!content) return res.status(400).json({ message: "Missing content." });
  if (!user_id) return res.status(400).json({ message: "Missing user ID." });

  try {
    const hasReviewed = await Reviews.findOne({ id, title, owner: user_id });
    if (hasReviewed)
      return res
        .status(409)
        .json({ message: `You have already posted a review for ${title}.` });

    const newReview = await Reviews.create({
      id,
      title,
      poster_path,
      owner: user_id,
      content,
    });

    res.json({ message: "Review posted.", newReview });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

/**
 * Handles retrieving reviews based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters for fetching reviews.
 * @param {String} req.query.id - The ID of the reviewed item.
 * @param {String} req.query.title - The title of the reviewed item.
 * @param {Number} req.query.page - The page number for pagination.
 * @param {Number} req.query.limit - The number of reviews per page (default is 20).
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the reviews and pagination info.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetReview = async (req, res) => {
  const { id, title, page, limit } = req.query;
  const paginationSize = parseInt(limit) || 5;
  const skip = (page - 1) * limit;

  if (!id) return res.status(400).json({ message: "Missing ID." });
  if (!title) return res.status(400).json({ message: "Missing title." });

  try {
    const reviews = await Reviews.find({ id: id })
      .skip(skip)
      .limit(paginationSize);

    const total = await Reviews.countDocuments({ id, title });
    const total_pages = Math.ceil(total / paginationSize);

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

/**
 * Handles liking or unliking a review.
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters for liking the review.
 * @param {String} req.query.id - The ID of the reviewed item.
 * @param {String} req.query.title - The title of the reviewed item.
 * @param {String} req.query.owner - The owner of the review.
 * @param {String} req.id - The ID of the authenticated user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object with a message about the like status.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleLike = async (req, res) => {
  const { id, title, owner } = req.query;
  const { id: user_id } = req;

  if (!id) return res.status(400).json({ message: "Missing ID." });
  if (!title) return res.status(400).json({ message: "Missing title." });

  try {
    const review = await Reviews.findOne({
      id: id,
      title: title,
      owner,
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.owner === user_id)
      return res
        .status(400)
        .json({ message: "You can't like your own review." });

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
    console.error(error);
    res.status(500).json({ message: "Error updating like status", error });
  }
};

const handleGetUserReviews = async (req, res) => {
  const { page, limit } = req.query;
  const { user_id: id } = req.params;
  const paginationSize = limit || 5;
  const skip = (page - 1) * limit;

  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const reviews = await Reviews.find({ owner: id })
      .skip(skip)
      .limit(paginationSize)
      .sort({ created_on: -1 });

    const total = await Reviews.countDocuments({ owner: id });
    const total_pages = Math.ceil(total / paginationSize);

    res.json({
      reviews,
      current_page: page,
      total_pages,
      total_reviews: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user reviews.");
  }
};

const handleSearchReviews = async (req, res) => {
  const { query, page, limit } = req.query;

  if (!query) return res.status(400).json({ message: "Missing query." });
  if (!page) return res.status(400).json({ message: "Missing page." });
  if (!limit) return res.status(400).json({ message: "Missing limit." });

  const paginationSize = parseInt(limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const reviews = await Reviews.find({ $text: { $search: query } })
      .skip(skip)
      .limit(paginationSize);

    const total = await Reviews.countDocuments({ $text: { $search: query } });
    const total_pages = Math.ceil(total / paginationSize);

    res.json({
      reviews,
      current_page: page,
      total_pages,
      total_reviews: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error searching reviews.");
  }
};

const handleDeleteReview = async (req, res) => {
  const { id: _id } = req.query;
  const { id: user_id } = req;

  if (!_id) return res.status(400).json({ message: "Missing ID." });

  try {
    const review = await Reviews.findById(_id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.owner !== user_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete review." });
    }

    await Reviews.deleteOne({ _id });

    res.json({ message: "Review deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting review.");
  }
};

module.exports = {
  handleGetReview,
  handlePostReview,
  handleDeleteReview,
  handleLike,
  handleGetUserReviews,
  handleSearchReviews,
};
