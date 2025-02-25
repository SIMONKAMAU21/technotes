import generateToken from "../utils/generateToken.js";
import User from "../model/userModal.js";
import { hashPassword, sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import bcrypt from 'bcryptjs'
import axios from "axios";


export const addUser = async (req, res) => {
  const { name, email, password, role, phone, address, gender } = req.body;

  try {
    const userExists = await User.findOne({ email }).lean().exec();
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
      gender,
    });

    // Save user to the database
    await user.save();

    // Create contact in Chatwoot (optional step)
    await createContactInChatwoot(user);

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
    const token = generateToken(user._id, user.role,user.name);
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
    const user = await User.findById(req.params.id).select('-password');
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
      return sendNotFound(res, 'User not found');
    }

    // Update fields only if they are provided
    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } }).exec();
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

// Helper function to create a contact in Chatwoot
const createContactInChatwoot = async (user) => {
  try {
    const response = await axios.post(
      `https://app.chatwoot.com/api/v1/accounts/${account_id}/contacts`,
      {
        name: user.name,
        email: user.email,
        phone_number: user.phone || "",
      },
      {
        headers: {
          api_access_token: `T5pFM4hnChzw7hRcr9rXc4R5`, 
          "Content-Type": "application/json",
        },
      }
    );
    console.log('response', response)
  } catch (error) {
    console.error("Error creating contact in Chatwoot:", error);
  }
};



// Helper function to create a conversation in Chatwoot
export const createConversation = async (req, res) => {
  const { contactId, inboxId, messageContent } = req.body;

  // Validate the required parameters
  if (!contactId || !inboxId || !messageContent) {
    return res.status(400).json({ message: "Missing required fields: contactId, inboxId, or messageContent." });
  }

  const payload = {
    source_id: "+25459717794", // Unique identifier for the contact
    inbox_id: "uHGgu78DoWy9V9LSetj596eu", // Chatwoot inbox ID
    contact_id: contactId, // Chatwoot contact ID, you can modify if needed
    additional_attributes: {},
    custom_attributes: {
      priority_conversation_number: 1, // Example of custom attributes
    },
    status: "open",
    message: {
      content: messageContent,
    },
  }
  // {
  //   "source_id": "string",
  //   "inbox_id": "string",
  //   "contact_id": "string",
  //   "additional_attributes": {},
  //   "custom_attributes": {
  //     "attribute_key": "attribute_value",
  //     "priority_conversation_number": 3
  //   },
  //   "status": "open",
  //   "assignee_id": "string",
  //   "team_id": "string",
  //   "message": {
  //     "content": "string",
  //     "template_params": {
  //       "name": "sample_issue_resolution",
  //       "category": "UTILITY",
  //       "language": "en_US",
  //       "processed_params": {
  //         "1": "Chatwoot"
  //       }
  //     }
  //   }
  // }
  try {
    // Make the API call to Chatwoot
    const response = await axios.post(
      `https://app.chatwoot.com/api/v1/accounts/${account_id}/conversations`,
      payload,

      {
        headers: {
          api_access_token: "T5pFM4hnChzw7hRcr9rXc4R5",
          "Content-Type": "application/json",
        },
      }
    );
    console.log('response', response)
    // Return success response with the conversation ID
    return res.status(201).json({
      message: "Conversation created successfully",
      conversationId: response.data.id,
    });
  } catch (error) {
    // Handle errors and return the appropriate response
    console.error("Error creating conversation in Chatwoot:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to create conversation", error: error.response?.data || error.message });
  }
};




