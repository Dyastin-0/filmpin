const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleRecommend = async (req, res) => {
  const { id } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result =
      await model.generateContent(`Help me with generating similar movies using the TMDb API.
      Create a list of at least 20 movies with similar themes/genres with ${id};
      return the result as plain JSON with no additional information, including their id and name. Do not include anything else to your responose.`);

    const response = result.response.text();
    const sanitizedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "");

    res.json(sanitizedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { handleRecommend };
