const jwt = require('jsonwebtoken');
const { CustomException } = require('../utils');

const userMiddleware = (request, response, next) => {
    const token = request.cookies.accessToken;

    try {
        if (!token) {
            throw CustomException('Unauthorized access!', 401);
        }

        const jwtSecret = process.env.JWT_SECRET || 'workhive_dev_secret';

        const verification = jwt.verify(token, jwtSecret);
        if (!verification) {
            throw CustomException('Invalid token!', 403);
        }

        request.userID = verification._id;
        request.isSeller = verification.isSeller;

        return next();
    } catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        });
    }
};

module.exports = userMiddleware;
