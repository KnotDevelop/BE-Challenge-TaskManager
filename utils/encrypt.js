const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });

const saltRounds = 10;
exports.hashPassword = async (myPlaintextPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(myPlaintextPassword, salt);
        return hash;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.comparePassword = async (myPlaintextPassword, hash) => {
    try {
        const result = await bcrypt.compare(myPlaintextPassword, hash);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
exports.expireTime = 60 * 60;
exports.generateToken = async (data) => {
    try {
        const token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: exports.expireTime });
        return token;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.verifyToken = async (token) => {
    try {
        const result = await jwt.verify(token, process.env.JWT_SECRET);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}