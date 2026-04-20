const app = require("../backend/server");

/**
 * Vercel Serverless Function Entry Point
 * 
 * This file serves as a bridge for Vercel to look into the backend
 * folder and serve the Express app as a serverless function.
 */
module.exports = (req, res) => {
  // Ensure the Express app handles the request
  return app(req, res);
};
