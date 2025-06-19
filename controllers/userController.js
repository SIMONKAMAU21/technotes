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
import crypto from "crypto";
import Student from "../model/studentModal.js";
import { io } from "../lib/socket.js";

//CRUD
export const addUser = async (req, res) => {
  const { name, email, role, phone, address, gender } = req.body;

  try {
    const userExists = await User.findOne({ email, phone }).lean().exec();
    if (userExists) {
      return sendBadRequest(res, "User already exists");
    }
    const passcode = Math.floor(1000 + Math.random() * 900000).toString();
    const hashedPassword = await hashPassword(passcode);
    const loginUrl = `https://technote-client.vercel.app/`;
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      gender,
    });
    const text = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
    <p>We are pleased to inform you that you have been successfully registered.</p>

    <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #333;">Your Credentials:</h3>
      <p><strong>Email:</strong> <span style="color:rgb(76, 175, 80); font-weight: bold;">${email}</span></p>
      <p><strong>Password:</strong> <span style="color: rgb(76, 175, 80); font-weight: bold;">${passcode}</span></p>
      <p style="color: #d9534f; font-size: 14px;">Please log in and change your password as soon as possible.</p>
    </div>

    <a href="${loginUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>

    <p style="margin-top: 20px;">If you have any questions, feel free to contact us.</p>

    <hr style="border: 1px solid #ddd;">
    <p style="font-size: 14px; color: #666;">Best Regards, <br><strong>School Admin</strong></p>
  </div>
`;

    // Save user to the database
    const userStore = await user.save();
    io.emit("userAdded", userStore);
    sendEmail(email, "your passcode ", text, true);
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
    const { email, password, ID } = req.body;
    // Find the user by email
    let user;
    if (ID) {
      const student = await Student.findOne({ studentId: ID })
        .populate("userId")
        .exec();
      if (!student) {
        return sendNotFound(res, "Student not found");
      }
      user = student.userId;
    } else {
      user = await User.findOne({ email }).lean().exec();
    }
    if (!user) {
      return sendNotFound(res, "User not found");
    }

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
        photo: user.photo,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
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
    const userId = user._id;
    io.emit("userDeleted", userId);
    await user.deleteOne();
    sendDeleteSuccess(res, "User deleted successfully");
  } else {
    sendServerError(res, "User not deleted");
  }
};

// Get All Users - Retrieves all users from the database
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    io.emit("userFetched", users);
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
    const user = await User.findById(req.body.id).select("-password");
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

export const uploadProfilePhoto = async (req, res) => {
  const { id } = req.params; // Get the user ID from params

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return sendNotFound(res, "User not found");
    }

    const photoUrl = (user.photo = req.file.path);
    const updatedUser = await user.save();
    res.status(200).json({
      message: "Profile photo uploaded successfully",
      user: {
        ...updatedUser.toObject(),
        photo: photoUrl, // Full URL to access the image
      },
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, "Server error");
  }
};
