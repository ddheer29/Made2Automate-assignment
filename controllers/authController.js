const { hashPassword, comparePassword } = require('../helper/authHelper');
const User = require('../model/userModel')
const JWT = require('jsonwebtoken')


exports.registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Email already exists',
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = await new User({ name, email, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: 'Email registered successfully',
            user
        })
    } catch (error) {
        console.log(error);
        req.status(500).send({
            success: false,
            message: 'Error in registration',
            error
        })
    }
}


exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password',
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }
        const passwordCompare = await comparePassword(password, user.password);
        if (!passwordCompare) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid password" });
        }
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.log(error);
        req.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

exports.middlewarecheck = async (req, res) => {
    res.send('Welcome ')
}


