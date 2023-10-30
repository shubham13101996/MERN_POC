import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
export const Validation = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};
