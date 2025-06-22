import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We need to construct an absolute path to the .env file
// It should be in the 'Tech pulse' directory, which is two levels up from this file's config directory.
const envPath = path.resolve(__dirname, "..", "..", ".env");

console.log(`Attempting to load .env file from: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("🔴 Error loading .env file:", result.error);
}

if (result.parsed) {
  console.log(
    "✅ .env file loaded successfully. The following variables were found:"
  );
  console.log(Object.keys(result.parsed).join(", "));
} else {
  console.warn(`🟡 .env file not found or is empty at the expected location.`);
}
