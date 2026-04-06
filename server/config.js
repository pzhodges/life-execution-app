const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT) || 3000;
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || "").trim();
const OPENAI_MILESTONE_MODEL = (process.env.OPENAI_MILESTONE_MODEL || "gpt-4o-mini").trim();
const OPENAI_MISSION_MODEL = (process.env.OPENAI_MISSION_MODEL || OPENAI_MILESTONE_MODEL || "gpt-4o-mini").trim();

module.exports = {
  ROOT_DIR,
  PORT,
  OPENAI_API_KEY,
  OPENAI_MILESTONE_MODEL,
  OPENAI_MISSION_MODEL
};
