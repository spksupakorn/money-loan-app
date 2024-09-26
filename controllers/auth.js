const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res) => {

    try {
        const { username, password } = await req.body;
        let user = await User.findOne({ username })
        if (user) {
            return res.status(400)
                .json({
                    success: false,
                    message: 'User already registered.'
                })
        } 

        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            balance: 1000
        });
        await user.save();

        return res.status(201)
            .json({
                success: true,
                message: 'User registered successfully.'
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error."
            })
    }
}

const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400)
                .json({
                    success: false,
                    message: 'Invalid username or password.'
                })
        } 

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400)
                .json({
                    success: false,
                    message: 'Invalid username or password.'
                })
        }

        // const token = jwt.sign({ _id: user._id }, jwtSecret);

        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: '1h',
        });

        return res.status(200)
            .json({
                success: true,
                message: 'Login success.',
                token: token
            })
    } catch {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error."
            })
    }
}

module.exports = { register, login };