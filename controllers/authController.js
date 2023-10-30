import { comparePassword, hashPassword } from "../helper/authHelper.js";

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name || !password || !email || !phone || !address || !answer) {
      return res.send({
        message: "ALL FIELDS ARE MANDATORY",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered Please login ",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "User Login Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const validationController = (req, res) => {
  try {
    res.send({
      message: "protected",
    });
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is Required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is Required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "NewPassword is Required",
      });
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      res.status(400).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hasdpd = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hasdpd });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length > 6) {
      return res.json({
        error: "Password is required and should be atleast 6-character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating profile",
      error,
    });
  }
};
