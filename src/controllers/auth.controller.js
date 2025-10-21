import admin from '../utils/config/firebase.js';
import pkg from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import User from '../models/user.model.js';

const { sign } = pkg;

const saltRounds = 10;

// ✅ REGISTER USER
async function registerUser(req, res) {
  const { first_name, last_name, email, phone_number, password } = req.body;

  try {
    const hashedPassword = await hash(password, saltRounds);

    // Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${first_name} ${last_name}`,
      phoneNumber: phone_number || undefined,
    });

    // Insert into SQLite via model
    User.create(
      {
        firebase_uid: firebaseUser.uid,
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
      },
      function (err) {
        if (err) {
          console.error('SQLite error inserting user:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        return res.status(201).json({
          message: 'User registered successfully',
          firebase_uid: firebaseUser.uid,
        });
      }
    );
  } catch (error) {
    console.error('RegisterUser error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ✅ LOGOUT USER
async function logoutUser(req, res) {
  // JWTs are stateless, so "logout" is client-side
  res.status(200).json({ message: 'Logged out successfully' });
}

// ✅ LOGIN USER (Firebase token → verify → issue local JWT)
async function loginUser(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decoded;

    // Ensure user exists locally
    User.createIfNotExists(uid, email, name || '', (err, user) => {
      if (err) {
        console.error('SQLite lookup/insert error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const appToken = sign(
        {
          uid,
          email,
          role: user?.role || 'user',
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token: appToken,
        uid,
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
}
export default { registerUser, loginUser, logoutUser };
