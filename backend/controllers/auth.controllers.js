import { User } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendSuccessResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../brevo/emails.js";
import { config } from "dotenv";
config();


//Sign Up
export const signup = async(req, res)=>{
    const {email, name, password} = req.body;
    try {
        //Verify all fields are sent
        if(!email || !name || !password){
            throw new Error("All fields are required");
        }

        //Verify if user is already existed
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) return res.status(400).json({sucess: false, message: "User is already existed"});

        //Hash password
        const hashedPassword= await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        //Create user on MongoDB
        const user = new User({
            email, 
            password: hashedPassword, 
            name, 
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });
        
        await user.save();
        
        //JWT
        generateTokenAndSetCookie(res, user._id);

        //Verify Email
        await sendVerificationEmail(user.email, verificationToken);
        
        //Response to client
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(400).json({sucess: false, message: error.message});
    }
};

//Verify email
export const verifyEmail = async(req, res)=>{
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code, 
            verificationTokenExpiresAt: {$gt: Date.now()}
        });

        if(!user) return res.status(400).json({sucess: false, message: "Invalid or expired verification code"});

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        //Send Welcome E-mail
        await sendWelcomeEmail(user.email, user.name);

        //Response to client
        res.status(200).json({
            success: true, 
            message: "Welcome E-mail sent successfully", 
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({sucess: false, message: error.message});
    }
}

//Sign In
export const signin = async(req, res)=>{
    const {email, password} = req.body;
    try {
        //Search of user
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({success: false, message: "User not refistered"});

        //Verify password
        const passwordVerified = await bcryptjs.compare(password, user.password);
        if(!passwordVerified) return res.status(400).json({success: false, message: "Invalid password"});

        //JWT
        generateTokenAndSetCookie(res, user._id);

        //Changes on last session
        user.lastLogin = new Date();
        await user.save();

        //Response to client
        res.status(200).json({
            success: true, 
            message: "Login successful", 
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(400).json({success: false, message: error.message})
    }
};

//Logout
export const logout = async(req, res)=>{
    res.clearCookie("token");
    res.status(200).json({success: true, message: "User logged out successfully"});
};

//Forgot password
export const forgotPassword = async(req, res)=>{
    const {email} = req.body;
    try {
        //Search email
        const user = await User.findOne({email});
        if(!email) return res.status(400).json({success: false, message: "User not found"});

        //Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        //Save changes
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        //Send reset password email
        await sendResetPasswordEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        //Response to client
        res.status(200).json({success: false, message: "Reset password link sent successfully"})
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};

//Reset password
export const resetPassword = async(req, res)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;

        //Search of user by token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });

        if(!user) return res.status(400).json({success: false, message: "Invalid or expired reset token"});

        //Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user. resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        //Send successful reset email
        await sendSuccessResetEmail(user.email);

        //Response to Client
        res.status(200).json({success: true, message: "Password reseted successfully"});
    } catch (error) {
        console.log("Error in reset password: ", error);
        res.status(400).json({success: false, message: error.message});
    }
};

//Check Auth
export const checkAuth = async(req, res)=>{
    //Catch ID from request
    const id = req.userId;
    try {
        const user = await User.findById(id).select("-password");
        if(!user) return res.status(400).json({success: false, message: "User not found"});

        //Response to client
        res.status(200).json({success: true, message: "Authorized token access", user});
    } catch (error) {
        console.log("Error in check auth: ", error);
        res.status(400).json({success: false, message: error.message});
    }
};