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
    try {console.log("test")
        const { title, description, price, quantity,brand, seller,category } = req.body;
        //let cloudinaryResponse
        if (!title || !description || !price || !quantity|| !brand|| !seller|| !category) {
            return res.status(400).json({ message: "all fileds required" });
        }
        
        const sellerId = req.user.id;
        const categoryId = req.body.category;
        console.log("image===", req.file);
        
        if(req.file){
            cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            console.log("cldRes====", cloudinaryResponse);
        
        const productData = new Product({ title, description, price, quantity,brand, image: cloudinaryResponse.url, seller: sellerId,category:categoryId });
        } else{
            const productData = new Product({ title, description, price, quantity,brand, image, seller: sellerId,category:categoryId });
        }
        
        await productData.save();
        
        res.json({ data: productData, message: "Product created successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

/*
export const createProduct = async (req, res, next) => {
    try {
        const { title, description, price, quantity, brand, seller, category } = req.body;

        if (!title || !description || !price || !quantity || !brand || !seller || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const sellerId = req.user ? req.user.id : seller;
        const categoryId = category;

        let cloudinaryResponse = { url: "" };

        if (req.file) {
            cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
        }

        const productData = new Product({
            title,
            description,
            price,
            quantity,
            brand,
            image: cloudinaryResponse.url,
            seller: sellerId,
            category: categoryId
        });

        await productData.save();

        res.json({ data: productData, message: "Product created successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
*/

export const updateProduct = async (req, res, next) => {
    try {
        const { title, description, price, quantity,brand, seller,category } = req.body;
        //let cloudinaryResponse

        if (!title || !description || !price || !quantity|| !brand|| !seller|| !category) {
            return res.status(400).json({ message: "all fileds required" });
        }

        const sellerId = req.seller.id;
        const categotyId= req.category.id

        console.log("image===", req.file);

        if(req.file){
            cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        }

        console.log("cldRes====", cloudinaryResponse);

        const productData = new Product({ title, description, price, quantity,brand, image: cloudinaryResponse.url, seller: sellerId,category:categotyId });
        await productData.save();

        res.json({ data: productData, message: "Product data updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const productData = await Product.find();
        productData.deleteProduct()
        res.json({ message: "Product deleted..." });
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



