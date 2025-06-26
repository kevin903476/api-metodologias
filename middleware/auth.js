 const jwt = require('jsonwebtoken')
 const dotenv = require('dotenv');
 const process = require('process');
 dotenv.config();
 const auth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; //[1] es para obtener el token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token not found'
            });
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
 }

 module.exports = auth;