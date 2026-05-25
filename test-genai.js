const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIza...FAKE");
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
  try {
    const result = await model.generateContent("Test prompt");
    console.log("Success:", result);
  } catch (e) {
    console.error("Error with gemini-3.1-flash-image-preview:", e.message);
  }

  try {
    const model2 = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
    const result2 = await model2.generateContent("Test prompt");
    console.log("Success imagen:", result2);
  } catch(e) {
     console.error("Error with imagen:", e.message);
  }
}
run();
