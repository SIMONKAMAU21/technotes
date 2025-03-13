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
      return sendNotFound(res, "Teacher not found");
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
    .populate('teacherId', 'name email',)
    .populate('classId', 'name')
    .sort({ name: -1 });

    if (!subject || subject.length === 0) {
      return sendNotFound(res, "No subject found");
    } else {
      return res.status(200).json(subject);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getSubjectByTeacher =async (req,res) =>{
  const teacherId = req.params.id;
try {
  const subject = await Subject.find({teacherId: teacherId})
  .populate('teacherId', 'name email')
  .populate('classId', 'name')
  .sort({ name: -1 });
  if(!subject || subject.length === 0){
    return sendNotFound(res, "No subject found");
  }
  else{
    return res.status(200).json(subject);
  }

} catch (error) {
  return sendServerError(res, "Server error");
}
}
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


export const updateSubject = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { name, classId, teacherId, } = req.body; // Destructure updated fields from the request body

  try {
    // Check if the user exists
    const subject = await Subject.findById(id).exec();
    if (!subject) {
      return sendNotFound(res,'subject not found');
    }

    // Update fields only if they are provided
    if (name) subject.name = name;
    if (classId) {
      const classIdExists = await Class.findOne({ classId, _id: { $ne: id } }).exec();
      if (classIdExists) {
        return sendBadRequest("classId already in use")
      }
      subject.classId = classId;
    }
    if (teacherId) subject.teacherId = teacherId;

    // Save the updated user to the database
    const updatedUser = await subject.save();

    res.status(200).json({
      message: "subject updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    sendServerError(res,"server error")
  }
};