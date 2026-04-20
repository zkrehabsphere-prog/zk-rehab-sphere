const admin = require('firebase-admin');

// Initialize Firebase Admin with just the Project ID.
// For verifying ID tokens, the Project ID is sufficient.
// (Full service account credentials are required only for other admin actions like sending FCM, deleting users from backend, etc.)
admin.initializeApp({
  projectId: "zkrehabsphere-dff99",
});

module.exports = admin;
