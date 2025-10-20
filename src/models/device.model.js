const db = require('../../db');

/**
 * Executes a database query and returns a Promise.
 * @param {string} sql - SQL query string.
 * @param {Array} params - Parameters for the query.
 * @returns {Promise<any>}
 */
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

class DeviceModel {
    /**
     * C: Create a new device record.
     */
    static async create(deviceData) {
        const sql = `
            INSERT INTO Device (unique_serial_number, user_id, name)
            VALUES (?, ?, ?)
        `;
        const params = [deviceData.serial, deviceData.userId, deviceData.name];
        // Use db.run for INSERT/UPDATE/DELETE which doesn't return rows directly
        return new Promise((resolve, reject) => {
             db.run(sql, params, function(err) {
                if (err) {
                    return reject(err);
                }
                // 'this.lastID' contains the ID of the newly inserted row
                resolve({ id: this.lastID, ...deviceData });
            });
        });
    }

    /**
     * R: Get all devices for a user with pagination.
     */
    static async getAllByUserId(userId, page, limit) {
        const offset = (page - 1) * limit;

        // 1. Get the paginated results
        const devicesSql = `
            SELECT * FROM Device
            WHERE user_id = ?
            LIMIT ? OFFSET ?
        `;
        const devices = await query(devicesSql, [userId, limit, offset]);

        // 2. Get the total count for calculating total pages
        const countSql = `
            SELECT COUNT(*) AS total FROM Device
            WHERE user_id = ?
        `;
        const countResult = await query(countSql, [userId]);
        const totalCount = countResult[0].total;
        
        return { 
            data: devices, 
            total: totalCount, 
            page, 
            limit, 
            totalPages: Math.ceil(totalCount / limit) 
        };
    }

    /**
     * R: Get a single device by its ID.
     */
    static async getById(deviceId, userId) {
        // Ensure the device belongs to the user for security
        const sql = `
            SELECT * FROM Device
            WHERE device_id = ? AND user_id = ?
        `;
        const rows = await query(sql, [deviceId, userId]);
        return rows[0]; // Returns the device object or undefined
    }

    /**
     * U: Update a device's name or settings.
     */
    static async update(deviceId, userId, updates) {
        // Simple update example: update the name
        const sql = `
            UPDATE Device
            SET name = ?, battery_level = ?
            WHERE device_id = ? AND user_id = ?
        `;
        const params = [updates.name, updates.battery_level, deviceId, userId];
        // Use db.run for UPDATE
        return new Promise((resolve, reject) => {
             db.run(sql, params, function(err) {
                if (err) {
                    return reject(err);
                }
                // 'this.changes' reports the number of rows updated (0 or 1)
                resolve(this.changes > 0); 
            });
        });
    }

    /**
     * D: Delete (un-pair) a device.
     */
    static async delete(deviceId, userId) {
        const sql = `
            DELETE FROM Device
            WHERE device_id = ? AND user_id = ?
        `;
        // Use db.run for DELETE
        return new Promise((resolve, reject) => {
             db.run(sql, [deviceId, userId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes > 0); // true if deleted, false if not found/owned
            });
        });
    }
}

module.exports = DeviceModel;