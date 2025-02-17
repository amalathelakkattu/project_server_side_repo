import { cloudinaryInstance } from "../config/cloudinaryCofig.js";
import { Product } from "../models/productModel.js";

export const getProduct = async (req, res, next) => {
    try {
        const productList = await Product.find().select("-description");

        res.json({ data: productList, message: "Product List fetched..." });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getProductDetails = async (req, res, next) => {
    try {
        const {productId} = req.params;
        const productList = await Product.findById(productId).populate("seller");

        res.json({ data: productList, message: "Product Details fetched...." });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const createProduct = async (req, res, next) => {
    try {
        const { title, description, price, quantity, brand, seller, category } = req.body;
        console.log("body===",req.body)
        // Validate required fields
        if (!title || !description || !price || !quantity || !brand || !seller || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
       
        const sellerId = req.body.seller;
        console.log("SellerId==",sellerId);
        const categoryId = req.body.category;
        console.log("CategoryID==",categoryId)
        console.log("image===", req.file);

        let productData;

        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            console.log("cldRes====", cloudinaryResponse);

            productData = new Product({
                title,
                description,
                price,
                quantity,
                brand,
                image: cloudinaryResponse.url,
                seller: sellerId,
                category: categoryId
            });
        } else {
            // Handle the case where no image is uploaded
            productData = new Product({
                title,
                description,
                price,
                quantity,
                brand,
                image: null, // or a default image URL
                seller: sellerId,
                category: categoryId
            });
        }

        await productData.save();

        res.json({ data: productData, message: "Product created successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const updateProduct = async (req, res, next) => {
    try {
        const { title, description, price, quantity, brand, seller, category } = req.body;
        const productId = req.body.id; // Assuming the product ID is passed in the URL params
console.log("Product.findById(productId)===",Product.findById(productId))
        // Check if the product exists
        const existingProduct = await Product.findById(productId);
        console.log("existingProduct===",existingProduct)
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update fields if they are provided in the request
        if (title) existingProduct.title = title;
        if (description) existingProduct.description = description;
        if (price) existingProduct.price = price;
        if (quantity) existingProduct.quantity = quantity;
        if (brand) existingProduct.brand = brand;
        if (seller) existingProduct.seller = seller;
        if (category) existingProduct.category = category;

        // Handle image upload if a new file is provided
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            existingProduct.image = cloudinaryResponse.url; // Update the image URL
        }

        // Save the updated product
        await existingProduct.save();

        res.json({ data: existingProduct, message: "Product updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.body.id; // Assuming the product ID is passed in the URL params

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
// Product Filters route
export const productsFilter = async (req, res, next) => {
    const { priceMin, priceMax, brand, ratings } = req.query;

    try {
        const filters = {};

        if (priceMin || priceMax) {
            filters.price = {};
            if (priceMin) filters.price.$gte = priceMin;
            if (priceMax) filters.price.$lte = priceMax;
        }

        if (brand) filters.brand = brand;

        if (ratings) filters.ratings = { $gte: ratings };

        const products = await Product.find(filters);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error applying filters' });
    }
};

// Product Sort route
export const productsSort = async (req, res, next) => {
    const { sortBy } = req.query;

    try {
        let sortCriteria = {};

        if (sortBy === 'lowToHigh') {
            sortCriteria.price = 1;
        } else if (sortBy === 'newArrivals') {
            sortCriteria.createdAt = -1;
        } else {
            return res.status(400).json({ message: 'Invalid sort criteria' });
        }

        const products = await Product.find().sort(sortCriteria);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error sorting products' });
    }
};


