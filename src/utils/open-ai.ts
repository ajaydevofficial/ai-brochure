import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Uncomment to see the API key and model
// console.log("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
// console.log("OPENAI_MODEL", process.env.OPENAI_MODEL);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default client;
