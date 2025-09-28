const { User } = require('../models');
const { CustomException } = require('../utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const satelize = require('satelize'); // Optional if IP geolocation is needed
const saltRounds = 10;

const authRegister = async (request, response) => {
    const { username, email, phone, password, image, isSeller, description } = request.body;

    console.log('📦 Incoming data:', request.body);

    try {
        const hash = bcrypt.hashSync(password, saltRounds);
        console.log('🔐 Password hashed');

        const user = new User({
            username,
            email,
            password: hash,
            image,
            country: "India", // Optional: integrate satelize for actual IP-based country
            description,
            isSeller,
            phone
        });

        await user.save();
        console.log('✅ User saved successfully');

        return response.status(201).send({
            error: false,
            message: 'New user created!'
        });
    } catch (error) {
        console.error('❌ Error during registration:', error);

        if (error.message.includes('E11000')) {
            return response.status(400).send({
                error: true,
                message: 'Choose a unique username!'
            });
        }

        return response.status(500).send({
            error: true,
            message: 'Something went wrong!'
        });
    }
};

const authLogin = async (request, response) => {
    const { username, password } = request.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw CustomException('Check username or password!', 404);
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw CustomException('Check username or password!', 404);
        }

        const jwtSecret = process.env.JWT_SECRET || 'workhive_dev_secret';

        const token = jwt.sign(
            {
                _id: user._id,
                isSeller: user.isSeller
            },
            jwtSecret,
            { expiresIn: '60d' }
        );

        const cookieConfig = {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 60 * 1000, // 60 days
            path: '/'
        };

        const { password: _, ...safeUser } = user._doc;

        return response
            .cookie('accessToken', token, cookieConfig)
            .status(202)
            .send({
                error: false,
                message: 'Success!',
                user: safeUser
            });
    } catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        });
    }
};

const authLogout = async (request, response) => {
    return response
        .clearCookie('accessToken', {
            sameSite: 'none',
            secure: true
        })
        .send({
            error: false,
            message: 'User has been logged out!'
        });
};

const authStatus = async (request, response) => {
    try {
        const user = await User.findOne({ _id: request.userID }).select('-password');

        if (!user) {
            throw CustomException('User not found!', 404);
        }

        return response.send({
            error: false,
            message: 'Success!',
            user
        });
    } catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        });
    }
};

module.exports = {
    authLogin,
    authLogout,
    authRegister,
    authStatus
};
