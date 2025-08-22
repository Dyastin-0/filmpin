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
  const { username, email, password } = req.body;

  if (!username) return res.status(400).json({ message: "Username missing." });

  if (!email) return res.json({ message: "Email missing." });

  if (!password) return res.status(400).json({ message: "Password missing." });

  const verificationToken = jwt.sign(
    { email: email },
    process.env.EMAIL_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  try {
    sendHtmlEmail(
      email,
      "Verify your Filmpin account",
      emailTemplate(
        `Welcome to Filmpin, ${username}!`,
        "To proceed with accessing our app, please click the link below. You may disregard this email if you did not sign up to our up.",
        `${process.env.BASE_CLIENT_URL}/account/verification?verificationToken=${verificationToken}`,
        "Verify your account"
      )
    );
  } catch (error) {
    res
      .sendStatus(400)
      .json({ message: "Non-existent email address." });
    return
  }

  try {
    const usernameExist = await Users.findOne({ username: username });

    if (usernameExist)
      return res.status(400).json({
        message: `Username ${username} is already used.`,
      });

    const emailExist = await Users.findOne({ email });

    if (emailExist)
      return res
        .status(400)
        .json({ message: `Email ${email} is already used.` });

    const hashedPassword = await hash(password);

    await Users.create({
      username,
      email,
      password: hashedPassword,
    });


    await Users.updateOne(
      { email: email },
      { $set: { verificationToken: verificationToken } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .sendStatus(500)
      .json({ message: "internal server error" });
  }
};

module.exports = handleSignup;
