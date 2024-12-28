
import { sendBadRequest, sendCreated, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Student from "../model/studentModal.js";
import User from "../model/userModal.js";

export const addStudent = async (req, res) => {
  const { userId, classId, parentId, dob, address, enrollmentDate } = req.body;

  try {
    // Check if the user exists and fetch their data
    const user = await User.findOne({ _id: userId }).lean().exec();
    if (!user) {
      return sendNotFound(res, "User not found");
    }

    // Check if the user is a student
    if (user.role !== "student") {
      return sendBadRequest(res, "User is not a student");
    }

    // Check if the student already exists
    const existingStudent = await Student.findOne({ userId }).lean().exec();
    if (existingStudent) {
      return sendBadRequest(res, "Student already exists");
    }

    // Create the new student
    const newStudent = new Student({
      userId,
      classId,
      parentId,
      dob,
      address,
      enrollmentDate: enrollmentDate || new Date(), // Use current date if not provided
    });

    await newStudent.save();
    sendCreated(res, "Student created successfully", newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteStudent = async (req, res) => {
    const newStudent = await Student.findById(req.params.id);
    if (!newStudent) {
      sendNotFound(res, "Student not found");
    }
    if (newStudent) {
      await newStudent.deleteOne();
      sendDeleteSuccess(res, "Student deleted succefully");
    } else {
      sendServerError(res, "Student not deleted");
    }
  };

    
  export const getAllStudents = async (req, res) => {
    try {
      const students = await Student.find({})
        .populate('userId', 'name')
        .populate('parentId', 'name')
        .populate('classId', 'name')
        .sort({ name: -1 });
  
      // Filter out students where userId or parentId does not exist or is incomplete
      const filteredData = students.filter(student => {
        const isUserValid = student.userId; // Ensure userId is populated
        const isParentValid = !student.parentId || student.parentId.name; // Ensure parentId has a valid name or is null
        return isUserValid && isParentValid;
      });
  
      if (!filteredData || filteredData.length === 0) {
        return sendNotFound(res, "No students found");
      } else {
        return res.status(200).json(filteredData);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  