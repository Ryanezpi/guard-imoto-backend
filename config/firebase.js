const admin = require('firebase-admin');

// Path to your service account key file
const serviceAccount = require('./guard-imoto-project-firebase-adminsdk-fbsvc-6da6790360.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase project:", admin.app().options.credential.projectId);


module.exports = admin;