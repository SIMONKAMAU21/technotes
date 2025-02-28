import generateToken from "../utils/generateToken.js";
import User from "../model/userModal.js";
import {
  hashPassword,
  sendBadRequest,
  sendCreated,
  sendDeleteSuccess,
  sendNotFound,
  sendServerError,
} from "../helpers/helperFunctions.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../middleware/mailer.js";
import crypto from 'crypto'
//CRUD
export const addUser = async (req, res) => {
  const { name, email, role, phone, address, gender } = req.body;

  try {
    const userExists = await User.findOne({ email, phone }).lean().exec();
    if (userExists) {
      return sendBadRequest(res, "User already exists");
    }

    const passcode = crypto.randomBytes(4).toString('hex');
    console.log("passcode", passcode);
    const hashedPassword = await hashPassword(passcode);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      gender,
    });

    // Save user to the database
    await user.save();
    sendEmail(email, passcode, "your passcode ");
    // Send a success response
    sendCreated(res, "User created successfully", user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login - Authenticates user and generates JWT token
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
    const token = generateToken(user._id, user.role, user.name);
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

// Delete User - Deletes a user by ID
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    sendNotFound(res, "User not found");
  }
  if (user) {
    await user.deleteOne();
    sendDeleteSuccess(res, "User deleted successfully");
  } else {
    sendServerError(res, "User not deleted");
  }
};

// Get All Users - Retrieves all users from the database
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ name: -1 });

    if (!users || users.length === 0) {
      return sendNotFound(res, "No users found");
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get User By ID - Retrieves a specific user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).send(user);
    } else {
      sendNotFound(res, "No user with the ID is found");
    }
  } catch (error) {
    sendServerError(res, "Something went wrong");
  }
};

// Update User - Updates user information by ID
export const updateUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { name, email, role, phone, address, gender } = req.body; // Destructure updated fields from the request body

  try {
    // Check if the user exists
    const user = await User.findById(id).exec();
    if (!user) {
      return sendNotFound(res, "User not found");
    }

    // Update fields only if they are provided
    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: id },
      }).exec();
      if (emailExists) {
        return sendBadRequest(res, "Email already in use");
      }
      user.email = email;
    }
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;

    // Save the updated user to the database
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(id).exec();
    if (!user) {
      return sendNotFound(res, "User not found");
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return sendBadRequest(res, "old password did not match");
    }
    if (oldPassword === newPassword) {
      return sendBadRequest(
        res,
        "old password and new password cannot be the same"
      );
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    sendServerError(res, "Server error");
  }
};
