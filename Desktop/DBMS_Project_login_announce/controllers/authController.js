import mysql from '../lib/mysql.js';
import bcrypt from 'bcrypt';

// 註冊功能
export const register = async (req, res) => {
    const { role, user_id, user_name, password, user_email, user_telephone } = req.body;

    try {
        // 根據 role 決定查哪個表
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

        // 加密密碼
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
const loginAttempts = {}; // { user_name: { count: 0, lockUntil: null } }

export const login = async (req, res) => {
    const { role, user_name, password } = req.body;

    try {
        const tableName = role === 'tenant' ? 'Tenant' : 'Landlord';
        const nameField = role === 'tenant' ? 'tenant_name' : 'landlord_name';
        const idField = role === 'tenant' ? 'tenant_ID' : 'landlord_ID';

        // 檢查是否被鎖定
        const attempt = loginAttempts[user_name];
        const now = Date.now();
        if (attempt && attempt.lockUntil && now < attempt.lockUntil) {
            const secondsLeft = Math.ceil((attempt.lockUntil - now) / 1000);
            return res.status(403).json({ message: `Too many failed attempts. Please try again after ${secondsLeft} seconds.` });
        }

        // 查找使用者（用 nameField 查詢）
        const [rows] = await mysql.query(
            `SELECT * FROM ${tableName} WHERE ${nameField} = ?`,
            [user_name]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Account does not exist, please try again." });
        }

        const user = rows[0];

        // 比對密碼
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // 記錄失敗次數
            if (!loginAttempts[user_name]) {
                loginAttempts[user_name] = { count: 1, lockUntil: null };
            } else {
                loginAttempts[user_name].count += 1;
            }

            // 如果失敗5次，鎖定3分鐘（180秒）
            if (loginAttempts[user_name].count >= 5) {
                loginAttempts[user_name].lockUntil = now + 3 * 60 * 1000;
                loginAttempts[user_name].count = 0;
            }

            return res.status(400).json({ message: "Incorrect password, please try again." });
        }

        // 登入成功，清除失敗記錄
        if (loginAttempts[user_name]) {
            delete loginAttempts[user_name];
        }

        // 登入成功後 → 存 session
        req.session.user = {
            user_ID: user[idField],
            identity: role,
            landlord_ID: role === 'landlord' ? user.landlord_ID : undefined,
            tenant_ID: role === 'tenant' ? user.tenant_ID : undefined
        };

        res.status(200).json({ message: "Login successful!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 個人資料編輯功能
export const updateProfile = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { user_ID, identity } = req.session.user;
    const { user_name, old_password, new_password, user_email, user_telephone } = req.body;

    const tableName = identity === 'tenant' ? 'Tenant' : 'Landlord';
    const idField = identity === 'tenant' ? 'tenant_ID' : 'landlord_ID';
    const nameField = identity === 'tenant' ? 'tenant_name' : 'landlord_name';
    const emailField = identity === 'tenant' ? 'tenant_email' : 'landlord_email';
    const phoneField = identity === 'tenant' ? 'tenant_telephone' : 'landlord_telephone';

    try {
        const [rows] = await mysql.query(
            `SELECT * FROM ${tableName} WHERE ${idField} = ?`,
            [user_ID]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = rows[0];

        // 要改密碼，必須驗證原密碼
        let hashedPassword = user.password; // 預設保留原密碼

        if (old_password && new_password) {
            const passwordMatch = await bcrypt.compare(old_password, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: "Original password is incorrect." });
            }

            hashedPassword = await bcrypt.hash(new_password, 10);
        }

        // 驗證成功 → 新密碼；失敗 → 沿用舊密碼
        await mysql.query(
            `UPDATE ${tableName}
             SET ${nameField} = ?, ${emailField} = ?, ${phoneField} = ?, password = ?
             WHERE ${idField} = ?`,
            [user_name, user_email, user_telephone, hashedPassword, user_ID]
        );

        res.status(200).json({ message: "Profile updated successfully!" });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
