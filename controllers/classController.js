import { sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Class from "../model/classModal.js";
import User from "../model/userModal.js";

export const addClass = async (req, res) => {
  const { name, teacherId } =
    req.body;
  try {
    const user = await User.findOne({ _id: teacherId }).lean().exec();
    if (!user) {
      return sendNotFound(res, "Teacher not found")

    }
    const teacherCheck = await Class.findOne({teacherId }).lean().exec()
    console.log('first', teacherCheck)
    if (teacherCheck) {
      return sendBadRequest(res, "Teacher is already assigned to another class")
    }
    if (user.role !== 'teacher') {
      return sendBadRequest(res, "user is not a teacher")
    }
      // Check if a class with the same name already exists
      const classNameCheck = await Class.findOne({ name }).lean().exec();
      if (classNameCheck) {
        return sendBadRequest(res, "A class with the same name already exists");
      }
    const newClass = new Class({
      name,
      teacherId,
    });
    await newClass.save();
    sendCreated(res, "class created successfully", newClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteClass = async (req, res) => {
  const newClass = await Class.findById(req.params.id);
  if (!newClass) {
    sendNotFound(res, "Class not found");
  }
  if (newClass) {
    await newClass.deleteOne();
    sendDeleteSuccess(res, "Class deleted succefully");
  } else {
    sendServerError(res, "Class not deleted");
  }
};


export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({}).populate('teacherId', 'name').sort({ name: -1 });

    if (!classes || classes.length === 0) {
      return sendNotFound(res, "No classes found");
    } else {
      return res.status(200).json(classes);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};