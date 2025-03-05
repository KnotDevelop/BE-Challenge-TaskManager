const { token } = require('morgan');
const pool = require('../db/pool');
const encrypt = require('../utils/encrypt')
const err = require('../utils/errorHandle');
require('dotenv').config({ path: './config.env' });

exports.signup = async (req, res, next) => {
    try {
        const body = req.body;
        //check duplicate account
        const sqlCheckDup = `SELECT * FROM users
                            WHERE email=$1;`;
        const dubUser = await pool.query(sqlCheckDup, [body.email]);
        if (dubUser.rowCount > 0) {
            return err.mapError(400, 'This email have already used', next);
        }
        //signup account
        const sql = `INSERT INTO users (name, email, password, role)
                    VALUES ($1, $2, $3, $4);`;
        const password = await encrypt.hashPassword(body.password);
        const result = await pool.query(sql, [body.name, body.email, password, body.role]);
        if (result.rowCount > 0) {
            return res.status(200).json({ status: 'Succes', message: 'Signup success' });
        } else {
            return err.mapError(400, 'Signup fail', next);
        }
    } catch (error) {
        console.log(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
exports.login = async (req, res, next) => {
    try {
        const body = req.body;
        const sql = `SELECT * FROM users
                    WHERE email=$1;`;
        const result = await pool.query(sql, [body.email]);
        if (result.rowCount > 0) {
            const compareResult = await encrypt.comparePassword(body.password, result.rows[0].password);
            if (compareResult) {
                const token = await encrypt.generateToken({
                    id: result.rows[0].id,
                    role: result.rows[0].role
                });
                return res.status(200).cookie('jwt', token, {
                    expires: new Date(Date.now() + encrypt.expireTime * 1000), // ใช้เวลาหมดอายุจาก encrypt.expireTime
                    secure: process.env.NODE_ENV, // ใช้ secure cookie เมื่ออยู่ใน environment production
                    httpOnly: true, // ทำให้ cookie ไม่สามารถเข้าถึงจาก JavaScript
                    sameSite: 'Strict' // ใช้ sameSite: 'Strict' เพื่อป้องกัน CSRF attacks
                }).json({
                    status: 'Success',
                    message: 'Login success'
                });
            } else {
                return err.mapError(400, 'Invalid password', next);
            }
        } else {
            return err.mapError(404, 'Not found this account', next);
        }
    } catch (error) {
        console.log(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
exports.getAllUsers = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
        if (result.rowCount > 0) {
            res.status(200).json({ status: 'Success', data: result.rows });
        } else {
            return err.mapError(404, 'Users not found', next);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ massege: 'Failed to fetch users' });
    }
}
exports.getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM users
                    WHERE id=$1;`;
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ status: 'Success', data: result.rows[0] });
        } else {
            return err.mapError(404, 'Users not found', next);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ massege: 'Internal server error' });
    }
}
exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const data = await encrypt.verifyToken(token);
            req.user = {
                id: data.id,  // กำหนด id ของผู้ใช้
                role: data.role // กำหนด role ของผู้ใช้
            };
        } catch (error) {
            return err.mapError(400, 'Verify token fail', next);
        }
        next();
    } else {
        return err.mapError(401, 'Invalid token', next);
    }
}
exports.verifyPermissionAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return err.mapError(401, 'Invalid permission', next);
    }
    next();
}