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
    const passcode = crypto.randomBytes(4).toString("hex");
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
    const text = `Welcome! ${name} Your generated password to access your account is: ${passcode}\nPlease log in and change it as soon as possible.`;
    // Save user to the database
    const userStore = await user.save();
    io.emit("userAdded", userStore);
    sendEmail(email, "your passcode ", text, false);
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
