import User from '../models/User.js'
import bcyprt from 'bcrypt'
import dotenv from 'dotenv'
import { genrateTokenAndSetCookie } from '../utils/genrateJwtToken.js'
import { sendVerificationEmail, sendWelcomeEmail } from '../nodeMailer/emails.js'
dotenv.config()

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const signUp = async (req, res) => {
    let { username, email, password } = req.body;
    console.log(username, email, password);

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "These fields are required", success: false });
        }
        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be greater than 3 letters", success: false });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email!", success: false });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password should be 6 to 20 characters long with numeric, 1 lowercase, and 1 uppercase letter", success: false });
        }

        const u = await User.findOne({ "personal_info.email": email });
        if (u) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        const hash_password = await bcyprt.hash(password, 10);
        const varificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            personal_info: {
                username,
                email,
                password: hash_password,
                varificationToken,
                verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hour 
                // verificationTokenExpiresAt: Date.now() + 1 * 60 * 1000, // 1 minute
            },
        });

        await user.save();

        genrateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.personal_info.email, varificationToken);

        return res.status(200).json({
            message: "Signup successful",
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000 || error.keyPattern?.email) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const varifyEmail = async (req, res) => {
    let { code } = req.body;
    try {
        const user = await User.findOne({
            "personal_info.varificationToken": code,
            "personal_info.verificationTokenExpiresAt": { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code", success: false })
        }

        user.personal_info.isVerified = true;
        user.personal_info.varificationToken = undefined;
        user.personal_info.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.personal_info.email, user.personal_info.username);

        res.status(200).json({
            message: "Email verified successfully",
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false })

    }
}

export const signIn = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ "personal_info.email": email });
        if (!user) {
            return res.status(400).json({ message: "Email not found!", success: false })
        }

        if (user.personal_info.verificationTokenExpiresAt && user.personal_info.verificationTokenExpiresAt < Date.now()) {
            const varificationToken = Math.floor(100000 + Math.random() * 900000).toString();

            user.personal_info.verificationTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour 
            user.personal_info.varificationToken = varificationToken;
            await user.save();

            genrateTokenAndSetCookie(res, user._id);
            await sendVerificationEmail(user.personal_info.email, varificationToken);

            return res.status(400).json({ message: "Email not verified, new verification code sent to your email", success: false })
        }
        if (user.personal_info.isVerified) {
            let match = await bcyprt.compare(password, user.personal_info.password);
            if (!match) {
                return res.status(400).json({ message: "Invalid email or password", success: false })
            }
            genrateTokenAndSetCookie(res, user._id);
            return res.status(200).json({
                message: "Signin successful",
                success: true,
                user: {
                    ...user._doc,
                    password: undefined
                }
            })
        }

        return res.status(400).json({ message: "Email not verified, Please varify your email", success: false })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const logOut = (req, res) => {
    res.status(200).json({
        message: "logOut successful",
        success: true
    })
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ "personal_info.email": "ankitbharatwaaj@gmail.com" })
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        res.status(200).json({
            message: "User deleted successfully",
            success: true,
            user
        })
    } catch (error) {

    }
}