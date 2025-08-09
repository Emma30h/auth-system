import jwt from "jsonwebtoken";


export const verifyToken = async(req, res, next)=>{
    //Catch token
    const {token} = req.cookies;
    //Verify if token exists
    if(!token) return res.status(401).json({success: false, message: "Unauthorized - Invalid token!"});
    try {
        //Decode token
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!tokenDecoded) return res.status(400).json({success: false, message: "Unauthorized - Invalid token!"});

        //Save token on Body
        req.userId = tokenDecoded.id;

        next();     
    } catch (error) {
        console.log("Error in verify token: ", error);
        res.status(400).json({success: false, message: error.message});
    }
};