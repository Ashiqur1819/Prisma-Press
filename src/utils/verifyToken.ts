import jwt from "jsonwebtoken";

export const verifyToken = (token: string, secretKey: string) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return {
            sucess: true,
            decoded
        }
    } catch (error) {
        return {
            sucess: false,
            error
        }
    }
};