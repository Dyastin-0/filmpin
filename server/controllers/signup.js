const Users = require("../models/user");
const { sendHtmlEmail } = require("../helpers/email");
const { emailTemplate } = require("../templates/email");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { hash } = require("../helpers/hash");

/**
 * Handles user signup by validating input, creating a new user,
 * generating a verification token, and sending a verification email.
 *
 * @param {Object} req - The request object containing user signup details.
 * @param {Object} req.body - The body of the request, expected to have:
 *   - {string} username - The username for the new account.
 *   - {string} email - The email for the new account.
 *   - {string} password - The password for the new account.
 * @param {Object} res - The response object used to send the result of the signup attempt.
 *
 * @returns {void} Sends a response indicating success or failure of the signup process.
 *
 * @throws {Error} Throws an error if there's an issue during the signup process.
 */
const handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username)
      return res
        .status(400)
        .json({ message: "Bad request. Username missing." });
    if (!email) return res.json({ message: "Bad request. Email missing." });
    const emailExist = await Users.findOne({ email });
    if (emailExist)
      return res
        .status(400)
        .json({ message: `Bad request. Email ${email} is already used.` });
    const usernameExist = await Users.findOne({ username });
    if (usernameExist)
      return res
        .status(400)
        .json({
          message: `Bad request. Username ${username} is already used.`,
        });
    if (!password)
      return res
        .status(400)
        .json({ message: "Bad request. Password missing." });

    const hashedPassword = await hash(password);

    await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    await Users.updateOne(
      { email: email },
      { $set: { verificationToken: verificationToken } }
    );

    sendHtmlEmail(
      email,
      "Verify your Filmpin account",
      emailTemplate(
        "Filmpin Account Verification",
        "To continue with our app, click the link below. \n If you ignore this email if you did not request for it.",
        `${process.env.BASE_CLIENT_URL}/account/verification?verificationToken=${verificationToken}`,
        "Verify your account"
      )
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = handleSignup;
