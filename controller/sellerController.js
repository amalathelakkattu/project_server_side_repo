import bcrypt from 'bcrypt'
import { generateToken } from '../utils/token.js';
import { seller } from '../models/sellerModel.js';


export const sellerSignup = async (req, res, next) => {
    try {
        const { name, email, password, phone,address, profilePic } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "all fields required" });
        }
        const isSellerExist = await seller.findOne({ email });

        if (isSellerExist) {
            return res.status(400).json({ message: "Seller already exist" });
        }

        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const newSeller = new seller({ name, email, password: hashedPassword, phone,address, profilePic });
        await newSeller.save();

        const token = generateToken(newSeller._id,'seller');

        res.cookie("token", token);
        // delete userExist._doc.password;
        {
            const { password, ...newSellerWithoutPassword } = newSeller._doc;
            return res.json({ data: newSellerWithoutPassword, message: "seller account created successfully" });
        }

        //res.json({ success: true,data:newSeller, message: "seller account created successfully" });
    } catch (error) {
        console.log(error);
    res.status(error.statusCode || 500).json(error.message || 'Internal server error')        
    }
};

export const sellerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isSellerExist = await seller.findOne({ email });
        if (!isSellerExist) {
            return res.status(404).json({ success: false, message: "seller does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, isSellerExist.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "user not autherized" });
        }

        const token = generateToken(isSellerExist._id,'seller');

        res.cookie("token", token);
        res.json({ success: true, message: "seller login successfull" });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || 'Internal server error')
    }
};


export const sellerProfile = async (req, res, next) => {
    try {

        const {user}=req

        const userData = await seller.findById(user.id).select('-password')

        res.json({ success: true, message: "seller profile fetched", userData });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || 'Internal server error')
    }
};
export const sellerLogout = async (req, res, next) => {
    try {

        res.clearCookie('token')
        res.json({ success: true, message: "seller logged out" });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || 'Internal server error')
    }
};
export const checkSeller = async (req, res, next) => {
    try {

        res.json({ success: true, message: "seller autherized" });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || 'Internal server error')
    }
};