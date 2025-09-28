const jwt = require('jsonwebtoken');
const { CustomException } = require("../utils");

const authenticate = (req, res, next) => {
  // Extract the access token from cookies
  const accessToken = req.cookies?.accessToken;

  // If the access token is missing, return a 401 error
  if (!accessToken) {
    return res.status(401).json({ 
      error: true, 
      message: 'Access token is required to access this resource' 
    });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Attach the userID (or whatever key your payload uses) to the request
    req.userID = decoded._id; // Ensure this matches the token payload structure

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // Catch errors like expired tokens or invalid tokens
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: true,
        message: 'Access token has expired, please log in again'
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        error: true,
        message: 'Invalid access token, please log in again'
      });
    } else {
      // If some other error occurs, send a generic message
      return res.status(500).json({
        error: true,
        message: 'An error occurred while verifying the token'
      });
    }
  }
};

module.exports = authenticate;
