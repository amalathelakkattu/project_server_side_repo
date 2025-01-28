import { Category } from "../models/categoryModel.js";
import { cloudinaryInstance } from "../config/cloudinaryCofig.js";

export const addCategory = async (req, res, next) => {
    try {

        const { title, description, image } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isCategoryExist = await Category.findOne({ title });

        if (isCategoryExist) {
            return res.status(400).json({ message: "Category already exist" });
        }
        if (req.file) {
            cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        }
        const categoryData = new Category({ title, description, image: cloudinaryResponse.url });
        await categoryData.save();

        return res.json({ data: categoryData, message: "Category created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const updateCategory = async (req, res, next) => {
    try {

        const { title, description, image } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isCategoryExist = await Category.findOne({ title });

        if (isCategoryExist) {
            return res.status(400).json({ message: "Category already exist" });
        }else{
            if (req.file) {
                cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            }
            const categoryData = new Category({ title, description, image: cloudinaryResponse.url });
            await categoryData.save();
    
            return res.json({ data: categoryData, message: "Category created" });
        }
        
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getCategory = async (req, res, next) => {
    try {
        const categoryList = await Category.find()

        res.json({ data: productList, message: "Category List fetched..." });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const deleteCategory = await Category.findByIdAndDelete()

        res.json({  message: "Category deleted..." });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const checkAdmin = async (req, res, next) => {
    try {
        return res.json({ message: "user autherized" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

