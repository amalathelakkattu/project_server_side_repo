import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to the product
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Order status (e.g., Pending, Shipped, Delivered)
    createdAt: { type: Date, default: Date.now }, // Timestamp of order creation
});

export const Order = mongoose.model("Order", orderSchema);
