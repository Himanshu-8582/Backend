import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');   // We use header for mobile apps where cookies are not supported
        if (!token) {
            throw new ApiError(401, 'Unauthorized! Access token is missing');
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError(401, 'Unauthorized! invalid access token');
        }
        req.user = user;   // attaching user to req object
        next();
    } catch (error) {
        throw new ApiError(401, error.message || 'Unauthorized! invalid access token');
    }
});