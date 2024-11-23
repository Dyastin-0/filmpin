const mongoose = require("mongoose");
const Users = require("../../../models/user");
const Lists = require("../../../models/list");
const Reviews = require("../../../models/review");
const { uploadImage, deleteImage } = require("../../../helpers/cloudinaryApi");
const { sendHtmlEmail } = require("../../../helpers/email");
const { emailTemplate } = require("../../../templates/email");

/**
 * Sets the profile image for a user by uploading it to Cloudinary.
 * @param {Object} req - The request object.
 * @param {string} req.query.user_id - The user ID from the request query.
 * @param {string} req.id - The authenticated user's ID from the request.
 * @param {Object} req.file - The image file uploaded by the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON containing the result from Cloudinary (including the image URL).
 * @throws {Error} If user is not found, file is missing, or an internal server error occurs, returns appropriate status codes.
 */
const handleSetProfile = async (req, res) => {
  const { id } = req;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "Missing file." });

  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).json({ message: "User not found." });

    const publicId = `${id}-profile`;
    const result = await uploadImage(file.buffer, publicId);

    sendHtmlEmail(
      user.email,
      "Profile Image Updated",
      emailTemplate(
        "Profile Image Updated",
        `Hello, ${user.username}! Your profile photo has been recently updated.`
      )
    );

    const profileURL = result.secure_url;
    await Users.updateOne(
      { _id: id },
      { $set: { profileImageURL: profileURL } }
    );

    res.json(result);
  } catch (error) {
    console.error("Failed to set profile.", error);
    res.sendStatus(500);
  }
};

const handleDeleteProfile = async (req, res) => {
  const { id } = req;

  try {
    const user = await Users.findOne({ _id: id });

    if (!user) return res.status(404).json({ message: "User not found." });

    await deleteImage(`${id}-profile`);

    await Users.updateOne({ _id: id }, { $set: { profileImageURL: null } });

    sendHtmlEmail(
      user.email,
      "Profile Image Deleted",
      emailTemplate(
        "Profile Image Deleted",
        `Hello, ${user.username}! Your profile photo has been recently deleted.`
      )
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to delete profile.", error);
    res.sendStatus(500);
  }
};

const handleUpdateUsername = async (req, res) => {
  const { username } = req.body;
  const { id } = req;

  if (!username) return res.status(400).json({ message: "Missing username." });

  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).json({ message: "User not found." });

    await Users.updateOne({ _id: id }, { $set: { username } });

    sendHtmlEmail(
      user.email,
      "Username Updated",
      emailTemplate(
        `Hello, ${username}!`,
        `Your username has been recently updated, previously ${user.username}.`
      )
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to update username.", error);
    res.sendStatus(500);
  }
};

const handleDelete = async (req, res) => {
  const { id } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await Users.findOne({ _id: id }).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found." });
    }

    await Lists.deleteMany({ owner: id }).session(session);
    await Reviews.deleteMany({ owner: id }).session(session);
    await deleteImage(`${id}-profile`);
    await Users.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    sendHtmlEmail(
      user.email,
      "Account Deletion",
      emailTemplate(
        "Account Deleted",
        "Your account has been successfully deleted."
      )
    );

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Failed to delete user.", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
};

module.exports = {
  handleSetProfile,
  handleDeleteProfile,
  handleUpdateUsername,
  handleDelete,
};
