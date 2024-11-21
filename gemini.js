const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run(prompt) {
  const genAI = new GoogleGenerativeAI("API-KEY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent([`${prompt}`]);
  const response = result.response.text();
  console.log(response);
  return response;
}

// run();

module.exports = { run };
