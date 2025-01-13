import { sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Class from "../model/classModal.js";
import Subject from "../model/subjectModal.js";
import User from "../model/userModal.js";

export const addSubject = async (req, res) => {
  const { name, classId, teacherId, createdAt } = req.body;

  try {
    // Check if the user exists and fetch their data
    const user = await User.findOne({ _id: teacherId }).lean().exec();
    if (!user) {
      return sendNotFound(res, "User not found");
    }
    // Check if the user is a student
    if (user.role !== "teacher") {
      return sendBadRequest(res, "User is not a teacher");
    }
    const classid = await Class.findOne({ _id: classId }).lean().exec();
    if (!classid) {
      return sendNotFound(res, "class not found");
    }


    // Check if the student already exists
    const existingStudent = await Subject.findOne({ name }).lean().exec();
    if (existingStudent) {
      return sendBadRequest(res, "Subject already exists");
    }

    // Create the new student
    const newClass = new Subject({
      name,
      classId,
      teacherId,
      createdAt: createdAt || new Date(), // Use current date if not provided
    });

    await newClass.save();
    sendCreated(res, "subject created successfully", newClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllSubjects = async (req, res) => {
  try {
    const subject = await Subject.find({})
    // .populate('teacherId', 'name')
    // .populate('classId', 'name')
    .sort({ name: -1 });

    if (!subject || subject.length === 0) {
      return sendNotFound(res, "No subject found");
    } else {
      return res.status(200).json(subject);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return sendNotFound(res, "subject not found"); // Return ensures no further execution
    }

    // Delete the subject
    await Subject.deleteOne({ _id: req.params.id });
    return sendDeleteSuccess(res, "subject deleted successfully"); // Send success response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
