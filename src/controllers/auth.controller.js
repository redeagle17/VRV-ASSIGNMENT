import {User} from "../models/user.model.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating refresh and access token"
        })
    }
}

const registerUser = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errors',
                errors: errors.array()
            });
        }
        
        const { name, email, password } = req.body;

        const isExistUser = await User.findOne({ email })

        if (isExistUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email id is already exist!'
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!createdUser){
            return res.status(500).json({
                success: false,
                message: "Something went wrong while registering the user"
            })
        }

        // Assigning the Default Permissions to created User

        // const defaultPermissions = await Permission.find({
        //     is_default: 1
        // });

        // if (defaultPermissions.length > 0) {

        //     const PermissionArray = [];

        //     defaultPermissions.forEach(permission => {

        //         PermissionArray.push({
        //             permission_name:permission.permission_name,
        //             permission_value:[0,1,2,3]
        //         });

        //     });

        //     const userPermission = new UserPermission({
        //         user_id:userData._id,
        //         permissions:PermissionArray
        //     });

        //     await userPermission.save();

        // }

        return res.status(201).json({
            success: true,
            message: 'User Registered Successfully!',
            data: createdUser
        });
        
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const loginUser = async (req, res) =>{

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Error',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User with this email id does not exist!'
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: 'Invalid user credentials'
            });
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        return res.status(200).json({
            success: true,
            data: {
                user: loggedInUser, accessToken, refreshToken
            },
            message: "User logged In Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }

}

export { registerUser, loginUser }