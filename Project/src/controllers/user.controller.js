import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {

    // Get data from frontend
    const { fullName,username, email, password } = req.body;      
    console.log('User Registration Data:', { username, email, password });

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
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar image is required');
    }

    // upload them to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required');
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
    const createdUser = await newUser.findById(newUser._id).select('-password -refreshToken');   // exclude sensitive info
    
    // check for created user
    if (!createdUser) {
        throw new ApiError(500,'Something went wrong while registering user');
    }

    // send response
    return res.status(201).json(new ApiResponse(200,'User registered successfully',createdUser));

});


export { registerUser };