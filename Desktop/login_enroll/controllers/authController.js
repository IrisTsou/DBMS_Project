import mysql from '../lib/mysql.js';
import bcrypt from 'bcrypt';

// 註冊功能
export const register = async (req, res) => {
    const { role, user_id, user_name, password, user_email, user_telephone } = req.body;

    try {
        // 根據角色決定查哪個表
        const tableName = role === 'tenant' ? 'Tenant' : 'Landlord';
        const idField = role === 'tenant' ? 'tenant_ID' : 'landlord_ID';

        // 檢查 user_id 是否已存在
        const [existingUser] = await mysql.query(
            `SELECT * FROM ${tableName} WHERE ${idField} = ?`, [user_id]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "This user_id has existed, please enter a new one!" });
        }

        // 檢查回傳的變數中是否有空值
        for (const [key, value] of Object.entries(idField)) {
            if (!value) {
                return res.status(400).json({ message: `${key} can't be null!` });
            }
        }

        // 可以加密密碼（推薦）
        const hashedPassword = await bcrypt.hash(password, 10);

        // 新增使用者
        await mysql.query(
            `INSERT INTO ${tableName} (${idField}, ${role}_name, password, ${role}_email, ${role}_telephone)
       VALUES (?, ?, ?, ?, ?)`,
            [user_id, user_name, hashedPassword, user_email, user_telephone]
        );

        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 登入功能
// 暫存登入失敗次數與鎖定時間
const loginAttempts = {}; // { user_id: { count: 0, lockUntil: null } }

export const login = async (req, res) => {
    const { role, user_id, password } = req.body;

    try {
        const tableName = role === 'tenant' ? 'Tenant' : 'Landlord';
        const idField = role === 'tenant' ? 'tenant_ID' : 'landlord_ID';

        // 檢查是否被鎖定
        const attempt = loginAttempts[user_id];
        const now = Date.now();
        if (attempt && attempt.lockUntil && now < attempt.lockUntil) {
            const secondsLeft = Math.ceil((attempt.lockUntil - now) / 1000);
            return res.status(403).json({ message: `Too many failed attempts. Please try again after ${secondsLeft} seconds.` });
        }

        // 查找使用者
        const [rows] = await mysql.query(
            `SELECT * FROM ${tableName} WHERE ${idField} = ?`,
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Account does not exist, please try again." });
        }

        const user = rows[0];

        // 比對密碼
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // 記錄失敗次數
            if (!loginAttempts[user_id]) {
                loginAttempts[user_id] = { count: 1, lockUntil: null };
            } else {
                loginAttempts[user_id].count += 1;
            }

            // 如果失敗5次，鎖定3分鐘（180秒）
            if (loginAttempts[user_id].count >= 5) {
                loginAttempts[user_id].lockUntil = now + 3 * 60 * 1000; // 3分鐘後才能解鎖
                loginAttempts[user_id].count = 0; // 重置失敗次數
            }

            return res.status(400).json({ message: "Incorrect password, please try again." });
        }

        // 登入成功，清除失敗記錄
        if (loginAttempts[user_id]) {
            delete loginAttempts[user_id];
        }

        // 登入成功後 → 存 session
        req.session.user = {
            user_ID: user_id,
            identity: role, // landlord or tenant
            landlord_ID: role === 'landlord' ? user.landlord_ID : undefined,
            tenant_ID: role === 'tenant' ? user.tenant_ID : undefined
        };

        // 可以回傳一些登入成功訊息或token
        res.status(200).json({ message: "Login successful!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};