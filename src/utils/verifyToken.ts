import jwt from "jsonwebtoken";

export const verifyToken = (token: string, secretKey: string) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
};