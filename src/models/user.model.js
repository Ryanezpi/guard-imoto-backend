import db from '../../db.js';

const User = {
  create: (data, callback) => {
    const { firebase_uid, first_name, last_name, email, phone_number, password } = data;
    db.run(
      `
      INSERT INTO User (firebase_uid, first_name, last_name, email, phone_number, password)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [firebase_uid, first_name, last_name, email, phone_number, password],
      callback
    );
  },

  getByFirebaseUid: (firebase_uid, callback) => {
    db.get(`SELECT * FROM User WHERE firebase_uid = ?`, [firebase_uid], callback);
  },

  getByEmail: (email, callback) => {
    db.get(`SELECT * FROM User WHERE email = ?`, [email], callback);
  },

  createIfNotExists: (firebase_uid, email, name, callback) => {
    db.get(`SELECT * FROM User WHERE firebase_uid = ?`, [firebase_uid], (err, row) => {
      if (err) return callback(err);
      if (row) return callback(null, row);

      db.run(
        `INSERT INTO User (firebase_uid, email, first_name, created_at) VALUES (?, ?, ?, datetime('now'))`,
        [firebase_uid, email, name],
        function (insertErr) {
          if (insertErr) return callback(insertErr);
          callback(null, { user_id: this.lastID, firebase_uid, email });
        }
      );
    });
  },

  updateProfile: (firebase_uid, data, callback) => {
    const { first_name, last_name, phone_number, profile_picture } = data;

    const query = `
        UPDATE User
        SET first_name = ?, last_name = ?, phone_number = ?, profile_picture = ?
        WHERE firebase_uid = ?
    `;

    db.run(
        query,
        [first_name, last_name, phone_number, profile_picture, firebase_uid],
        callback
    );
    },
};

export default User;
