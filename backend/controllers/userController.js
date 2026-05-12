
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
//import { response } from "express";
//import { use } from "react";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// route for user login
const loginUser = async (req, res) => {
    try {
        const {phone_no,password} = req.body;

        const user = await userModel.findOne({phone_no});
        if (!user) {
            return res.json({success:false, message:"user doesn't exists"})
            
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token =createToken(user._id)
            res.json({success:true,token,phone_no,username: user.name})
        }
        else{
            res.json({success:false, message:"Invalid Credentials"})
        }       
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }


}

//routes for user register
const registerUser = async (req, res) => {
    try{

        const {name,phone_no,password} = req.body;

        //checking user already exists or not 
        const exists = await userModel.findOne({phone_no});
        if (exists){
            return res.json({success:false, message:"user already exists"})
        }

        //validating password formate
       if(!validator.isMobilePhone(phone_no)){
            return res.json({success:false, message:"please enter a valid Phone No."})
       }
       if(password.length < 8){
            return res.json({success:false, message:"please enter strong password"})
       }

       //hashing user password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password,salt)

       const newUser = new userModel({
        name,
        phone_no,
        password:hashedPassword
       })

       const user = await newUser.save()

       const token = createToken(user._id)

       res.json({success:true, token})

    } catch(error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
    
}

export { loginUser, registerUser}

