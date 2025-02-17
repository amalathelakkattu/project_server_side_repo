import { Category } from "../models/categoryModel.js";
import { cloudinaryInstance } from "../config/cloudinaryCofig.js";


export const addCategory = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the category already exists
        const isCategoryExist = await Category.findOne({ title });
        if (isCategoryExist) {
            return res.status(400).json({ message: "Category already exists" });
        }

        let imageUrl = null;

        // Handle image upload if a file is provided
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            imageUrl = cloudinaryResponse.url;
        }

        // Create the category
        const categoryData = new Category({
            title,
            description,
            image: imageUrl // Use the uploaded image URL or null if no file is provided
        });

        await categoryData.save();

        return res.json({ data: categoryData, message: "Category created successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const categoryId = req.params.id; // Assuming the category ID is passed in the URL params

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the category exists
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Handle image upload if a new file is provided
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            existingCategory.image = cloudinaryResponse.url; // Update the image URL
        }

        // Update the category fields
        existingCategory.title = title;
        existingCategory.description = description;

        // Save the updated category
        await existingCategory.save();
        console.log("respo====",existingCategory)

        return res.json({ data: existingCategory, message: "Category updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getCategory = async (req, res, next) => {
    try {
        // Fetch all categories from the database
        const categoryList = await Category.find();

        // Return the list of categories
        res.json({ data: categoryList, message: "Category list fetched successfully" });
    } catch (error) {
        // Handle errors
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id; 

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Delete the category
        await Category.findByIdAndDelete(categoryId);

        res.json({ message: "Category deleted successfully" });
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
