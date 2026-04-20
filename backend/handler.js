const { onRequest } = require("firebase-functions/v2/https");
const app = require("./server");

/**
 * Firebase Cloud Function Entry Point
 * 
 * This wraps the Express app and exports it as a Firebase HTTPS function.
 * We use Gen 2 (v2) for better performance and configuration.
 */
exports.api = onRequest({
  memory: "256MiB",
  timeoutSeconds: 60,
  cors: true, // Enable CORS automatically for the function
}, app);
