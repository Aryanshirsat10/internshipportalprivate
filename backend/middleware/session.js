// session id token if needed
const Session = require("../models/sessionModel");
module.exports = async function validateSession(req, res, next) {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
        return res.status(400).send('Session ID is missing');
    }

    try {
        // Validate the session ID
        const isValid = isValidUuid(sessionId);
        if (!isValid) {
            return res.status(401).send('Invalid session ID');
        }
        const existingSession = await Session.findOne({ sessionId });
        if (!existingSession) {
            return res.status(401).send('Session not found. Please log in again.');
        }
        // Attach the session ID to the request object for use in subsequent middleware/routes
        req.sessionId = sessionId;

        next();
    } catch (error) {
        // Handle any errors that occur during validation
        console.error('Error validating session ID:', error);
        res.status(500).send('Internal server error');
    }
}

function isValidUuid(uuid) {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
}
