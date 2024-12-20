import generateToken from "../utils/generateToken.js";
import User from "../model/userModal.js";
import { hashPassword, sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import bcrypt from 'bcryptjs'
  // Controller to add a new user
  export const addUser = async (req, res) => {
    const { name, email, password, role, phone, address, dateOfBirth, gender } =
      req.body;
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return sendBadRequest(res, "User already exists");
      }
      const hashedPassword = await hashPassword(password);
  
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        dateOfBirth,
        gender,
      });
  
      // Save user to the database
      await user.save();
  
      sendCreated(res, "User created successfully", user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return sendNotFound(res, "User not found");
      }
      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return sendBadRequest(res, "Invalid credentials");
      }
      // Generate JWT token
      const token = generateToken(user._id,user.role);
      // Respond with token and user data
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return sendServerError(res, "Login failed");
    }
  };
  
  export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendNotFound(res, "user not found");
    }
    if (user) {
      await user.deleteOne();
      sendDeleteSuccess(res, "user deleted succefully");
    } else {
      sendServerError(res, "user not deleted");
    }
  };
  
  
  export const getAllUsers = async (req, res) => {
      try {
        const users = await User.find({}).sort({name:-1});
        
        if (!users || users.length === 0) {
          return sendNotFound(res, "No users found");
        } else {
          return res.status(200).json(users);
        }
      } catch (error) {
        return res.status(500).json({ message: "Server error" });
      }
    };
    
  
    export const getUserById = async(req,res)=>{
      try {
        const user = await User.findById(req.params.id)
        // .populate("")
        if (user) {
          res.status(200).send(user)
        } else {
          sendNotFound(res,"no user with the id is found")
        }
      } catch (error) {
        sendServerError(res,"something went wrong")
      }
    }
  
    