const api = require("../../helpers/tmdbApi");
const Users = require("../../models/user");

/**
 * Retrieves public account data for a given username.
 * @param {Object} req - The request object.
 * @param {string} req.query.username - The username of the user whose account is being fetched.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON object containing the user's public information.
 * @throws {Error} - Returns status 500 if an internal error occurs.
 */
const handleGetProfile = async (req, res) => {
  const { username, id } = req.query;

  if (!username && !id)
    return res.status(400).json({ message: "Missing user identifier." });

  try {
    const user =
      (await Users.findOne({ username })) || (await Users.findOne({ _id: id }));

    if (!user) return res.status(404).json({ message: "User not found." });

    const {
      password,
      refreshToken,
      verificationToken,
      recoveryToken,
      passwordResetToken,
      googleId,
      __v,
      ...userData
    } = user.toJSON();

    res.json({
      user: userData,
    });
  } catch (error) {
    console.error("Failed to get public account.", error);
    res.sendStatus(500);
  }
};

module.exports = {
  handleGetProfile,
};
