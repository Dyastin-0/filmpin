const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleRecommend = async (req, res) => {
  const { id, title } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result =
      await model.generateContent(`Using the TMDb API; create a list of 20 movies similar to the movie ${title} with id ${id};
      make sure that their IDs are correct fromy the TMDb.
      return the result as array of objects with no additional information of at least 20 movies, including their id and title.
      Do not include anything else to your responose.`);

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
