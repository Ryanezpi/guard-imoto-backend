import admin from 'firebase-admin';
import serviceAccount from './guard-imoto-project-firebase-adminsdk-fbsvc-6da6790360.json' with { type: 'json' };

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log('Firebase project:', admin.app().options.credential.projectId);

export default admin;
