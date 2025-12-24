import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {

    // Get data from frontend
    const { fullName, username, email, password } = req.body;

    // Validations
    if ( [fullName,email,password,username].some((field) => field?.trim()==="" )) {
        throw new ApiError(400, 'All fields are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
        throw new ApiError(409, 'User with given email or username already exists');
    }

    // check for coverimage and avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar image is required');
    }

    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log('Uploaded Avatar:', avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, 'Avatar upload failed');
    }

    // create user object in db
    const newUser = await User.create({
        fullName,
        username : username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    });

    // Remove password and refreshToken from response
    const createdUser = await User.findById(newUser._id).select('-password -refreshToken');   // exclude sensitive info
    
    // check for created user
    if (!createdUser) {
        throw new ApiError(500,'Something went wrong while registering user');
    }

    // send response
    return res.status(201).json(new ApiResponse(200,'User registered successfully',createdUser));

});

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });   // don't run validations before saving refresh token
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Error while generating tokens');
    }
}

const loginUser = asyncHandler(async (req, res) => {

    // Get data from frontend
    const { username, email, password } = req.body;
    if (!email && !username) {
        throw new ApiError(400, 'Email or Username is required to login');
    }

    // Check if user
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (!user) {
        throw new ApiError(404, 'User with given email or username does not exist');
    }

    // check for password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password');
    }

    // access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
    // sending cookies
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');   // exclude sensitive info , calls updated user info with tokens
    const options = {
        httpOnly: true,
        secure: true,
    }

    // send response
    return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, 'User login successfully', {user: loggedInUser, accessToken, refreshToken}));

});


const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, 'User logged out successfully',{}));
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token is missing');
    }

    try {
        const decodedToken=jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, 'Invalid refresh token');
        }
        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'Refresh token does not match or expired');
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const { accessToken, newRefreshToken }=await generateAccessAndRefreshTokens(user._id);
    
        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(new ApiResponse(200, 'Access token refreshed successfully', { accessToken, refreshToken: newRefreshToken }));
    } catch (error) {
        throw new ApiError(401,error?.message || 'Invalid refresh token');
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };