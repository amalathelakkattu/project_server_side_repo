import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

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

        const { name, email,password, phone, address, profilePic, role } = req.body;

        if (!name || !email || !password || !phone || !address || !role) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
            return res.status(400).json({ message: "user is not exist" });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);

            const userData =  User({ name, email,password: hashedPassword, phone, address, profilePic, role });
            await userData.save();

            //const token = generateToken(userData._id);
            //res.cookie("token", token);
            {
                const { password, ...userDataWithoutPassword } = userData._doc;
                return res.json({ data: userDataWithoutPassword, message: "user profile update success" });
            }
    
            //return res.json({ data: userData.select("-password"), message: "user account updated..." });
        }

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
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
};

//forgot password
//change password

