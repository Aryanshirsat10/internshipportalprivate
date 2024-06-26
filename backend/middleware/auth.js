const jwt = require('jsonwebtoken');
const Session = require("../models/sessionModel");
const Student = require("../models/Students");

module.exports = async function (req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send('Access denied. No token provided.');
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
        return res.status(401).send('Session ID is missing');
    }
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
        const userExists = await Student.findById(decoded.userId);
        if (!userExists) {
            return res.status(401).json({ message: 'User not found. Please log in again.' });
        }
         // Validate the session ID
        const isValid = isValidUuid(sessionId);
        if (!isValid) {
            return res.status(401).json({ message:'Invalid session ID' });
        }
        const existingSession = await Session.findOne({ sessionId });
        if (!existingSession) {
            return res.status(401).json({ message: 'Session not found. Please log in again.' });
        }
        // Attach the session ID to the request object for use in subsequent middleware/routes
        req.sessionId = sessionId;
        next();
    } catch (ex) {
        res.status(400).send(ex+'Invalid token.');
    }
};

function isValidUuid(uuid) {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
}