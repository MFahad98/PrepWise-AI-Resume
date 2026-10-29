const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklistModel");

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Check if the token is in the blacklist
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Unauthorized: Token has been revoked" });
    }

   try {
     let decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    req.user = decoded;
    next();
    } catch (err) { 
            return res.status(401).json({ message: "Unauthorized: Invalid token" });

    }
}

module.exports = {authUser};