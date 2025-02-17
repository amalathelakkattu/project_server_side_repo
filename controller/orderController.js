import { Order } from "../models/orderModel.js";// Import the Order model



// Route to get order details for a specific user
export const getOrder = async (req, res) => {
    try {
        const userId = req.user.id; 

        // Extract query parameters
        const { status, page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

        // Build the filter object
        const filter = { user: userId };
        if (status) {
            filter.status = status; 
        }

        // Calculate pagination values
        const skip = (page - 1) * limit;

        // Fetch orders with filtering, sorting, and pagination
        const orders = await Order.find(filter)
            .sort({ [sort]: order === "desc" ? -1 : 1 }) // Sort by the specified field and order
            .skip(skip) // Skip records for pagination
            .limit(parseInt(limit)) // Limit the number of records per page
            .populate("user", "name email") // Populate user details
            .populate("items.product", "name price"); // Populate product details in the order items

        // Count total orders for the user (for pagination)
        const totalOrders = await Order.countDocuments(filter);

        // Return the orders with pagination metadata
        res.json({
            data: orders,
            total: totalOrders,
            page: parseInt(page),
            // limit: parseInt(limit),
            message: "Orders fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id; 
        const orderId = req.params.orderId; 

        // Validate orderId
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        // Fetch the order by orderId and userId
        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate("user", "name email") // Populate user details
            .populate("items.product", "name price"); // Populate product details in the order items

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ message: "Order not found or does not belong to the user" });
        }

        // Return the order details
        res.json({ data: order, message: "Order fetched successfully" });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

