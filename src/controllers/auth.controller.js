const admin = require('../../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../db');

const saltRounds = 10;

// REGISTER USER
async function registerUser(req, res) {
  const { first_name, last_name, email, phone_number, password } = req.body;

  try {
    // 1️⃣ Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2️⃣ Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${first_name} ${last_name}`,
      phoneNumber: phone_number || undefined,
    });

    // 3️⃣ Insert into SQLite
    db.run(
      `
      INSERT INTO User (firebase_uid, first_name, last_name, email, phone_number, password)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [firebaseUser.uid, first_name, last_name, email, phone_number, hashedPassword],
      function (err) {
        if (err) {
          console.error('Error inserting user:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        return res.status(201).json({
          message: 'User registered successfully',
          firebase_uid: firebaseUser.uid,
          sql_user_id: this.lastID,
        });
      }
    );
  } catch (error) {
    console.error('RegisterUser error:', error);
    res.status(500).json({ error: error.message });
  }
}

// LOGIN USER
async function loginUser(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    // Verify token via Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Optional: ensure the user exists in your local DB
    const user = db.get(`SELECT * FROM User WHERE uid = ?`, [decoded.uid]);
    if (!user) {
      db.run(
        `INSERT INTO User (uid, email, name, createdAt) VALUES (?, ?, ?, datetime('now'))`,
        [decoded.uid, decoded.email, decoded.name || ""]
      );
    }

    // Generate your own backend JWT for API access
    const appToken = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email,
        role: user?.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: appToken,
      uid: decoded.uid,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
}

// LOGOUT USER (invalidate token client-side)
async function logoutUser(req, res) {
  // JWTs are stateless; logout just happens client-side.
  // But you can keep a blacklist table if you want forced invalidation.
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
