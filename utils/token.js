import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
    try {
        console.log(id,role)
        var token = jwt.sign({ id: id, role: role || "user" }, process.env.JWT_SECRET_KEY);
        
        return token;
    } catch (error) {
        console.log(error);
    }
};