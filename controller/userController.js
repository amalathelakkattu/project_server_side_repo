import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import crypto from "crypto"; // For generating reset tokens
import nodemailer from "nodemailer"; // For sending emails

export const userSignup = async (req, res, next) => {
    try {

        const { name, email, password, phone, address, profilePic, role } = req.body;

        if (!name || !email || !password || !phone || !address || !role) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const userData = new User({ name, email, password: hashedPassword, phone, address, profilePic, role });
        await userData.save();

        const token = generateToken(userData._id);
        res.cookie("token", token);
        console.log("token", token)

        // delete userExist._doc.password;
        {
            const { password, ...userDataWithoutPassword } = userData._doc;
            return res.json({ data: userDataWithoutPassword, message: "user account created" });
        }

        //return res.json({ data: userData, message: "user account created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "user does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: "user not authenticated" });
        }
        
        const token = generateToken(userExist._id);
   
        res.cookie("token", token);

        {
            const { password, ...userDataWithoutPassword } = userExist._doc;
            return res.json({ data: userDataWithoutPassword, message: "user login success" });
        }

        //return res.json({ data: userData, message: "user login success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        return res.json({ data: userData, message: "user profile fetched" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, address, profilePic, role } = req.body;
        const userId = req.user.id; // Assuming the user ID is available in the request (e.g., from authentication middleware)

        // Validate required fields
        if (!name || !email || !phone || !address || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the email is already taken by another user
        const isEmailTaken = await User.findOne({ email, _id: { $ne: userId } });
        if (isEmailTaken) {
            return res.status(400).json({ message: "Email is already taken" });
        }

        // Update the user profile
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.address = address;
        user.profilePic = profilePic;
        user.role = role;

        // Save the updated user profile
        await user.save();

        // Return the updated user profile (excluding the password)
        const { password, ...userDataWithoutPassword } = user._doc;
        res.json({ data: userDataWithoutPassword, message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "user logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const checkUser = async (req, res, next) => {
    try {
         return res.json({ message: "user autherized" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

//forgot password - Not Working
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Fetch the user by email
        const user = await User.findOne({ email });
        console.log("user==",user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
        console.log("resetToken==",resetToken)
        console.log("resetTokenExpiry==",resetTokenExpiry)
        // Save the reset token and expiry to the user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Send the reset token to the user's email
        const resetUrl = `http://yourapp.com/reset-password?token=${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
        };

        await transporter.sendMail(mailOptions);

        // Return success response
        res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

//change password
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming the user ID is available in the request (e.g., from authentication middleware)

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify the current password
        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Return success response
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

