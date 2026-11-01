// Backend URL. Set VITE_API_URL in .env for local dev (e.g. http://localhost:8000).
export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://adhd-fudz.onrender.com";

// Chrome extension ID. Each unpacked install gets its own ID, so set
// VITE_EXTENSION_ID to the one shown on chrome://extensions.
export const EXTENSION_ID =
  import.meta.env.VITE_EXTENSION_ID || "kilbgoalbeoffipibcgnmfigjkhcdhkn";
