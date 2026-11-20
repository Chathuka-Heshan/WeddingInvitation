// Project Configuration
// You can either paste your Google Web App URL below, or set VITE_GOOGLE_SCRIPT_URL in Cloudflare Pages environment variables.

export const CONFIG = {
  // Paste your deployed Google Apps Script Web App URL here:
  // Example: "https://script.google.com/macros/s/AKfycb.../exec"
  GOOGLE_SCRIPT_URL: import.meta.env.VITE_GOOGLE_SCRIPT_URL || ""
};
