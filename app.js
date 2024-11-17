const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { run } = require("./gemini");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/generateStory", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const description = await run(prompt);
    res.send(description);
  } catch (error) {
    console.error("Error generating description:", error);
    res.status(500).send("Failed to generate description. Please try again.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
