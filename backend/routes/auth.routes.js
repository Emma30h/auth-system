import { Router } from "express";
import { signin, signup, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

//Test
router.get(`/`, (req, res)=>{
    try {
        res.send(`Hello World!`)
    } catch (error) {
        res.send(error.message)
    }
});

//Check-auth
router.get(`/check-auth`,  verifyToken, checkAuth);

//Sign Up
router.post(`/signup`, signup);

//Log in
router.post(`/login`, signin);

//Log out
router.post(`/logout`, logout);

//Verify email route
router.post(`/verify-email`, verifyEmail);

//Forgot password
router.post(`/forgot-password`, forgotPassword);

//Reset password
router.post(`/reset-password/:token`, resetPassword);

export default router;