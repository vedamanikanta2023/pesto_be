// import * as env from 'dotenv';

import jwt from "jsonwebtoken";

// env.config();
// const accessTokenString = process.env.ACCESS_TOKEN_PRIVATE_KEY;

export const validateUserToken = (req,res,next)=>{
    const token = req.headers['authorization'].split(" ")[1];
    console.log('token',token,{accessTokenString:process.env.ACCESS_TOKEN_PRIVATE_KEY},'*******token*****');

    jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY,async(err,payload)=>{
        if(err){
            console.log('token validattion error',err,'********token validattion error**********');
            res.send({status:401,message:'Invalid Access Token'});
        }else{
            console.log('token validation successed');
            next();
        }
    })
    // next();
}