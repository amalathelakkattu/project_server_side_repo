import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";


export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate("product.productID");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ data: cart, message: "cart fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, product: [] });
        }

        const productExists = cart.products.some((item) => item.productId.equals(productId));
        if (productExists) {
            return res.status(400).json({ message: "Product already in cart" });
        }

        cart.products.push({
            productId,
            price: product.price,
        });

        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({ data: cart, message: "product added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter((item) => !item.productId.equals(productId));

        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({ data: cart, message: "product removed form cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};