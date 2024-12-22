import { sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Attendance from "../model/attendanceModal.js";
import Class from "../model/classModal.js";
import Student from "../model/studentModal.js";

export const addAttedance = async (req, res) => {
    const { date, classId, studentId, status } = req.body;
  
    try {
      // Check if the user exists and fetch their data
      const user = await Student.findOne({ _id: studentId }).lean().exec();
      if (!user) {
        return sendNotFound(res, "student not found");
      }
      
      const classid = await Class.findOne({ _id: classId }).lean().exec();
      if (!classid) {
        return sendNotFound(res, "class not found");
      }
  
      // Create the new student
      const newAttendance = new Attendance({
        date : date || new Date,
        classId,
        studentId,
        status, // Use current date if not provided
      });
  
      await newAttendance.save();
      sendCreated(res, "Attendance created successfully",newAttendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


    
  export const getAllAttendance = async (req, res) => {
    try {
      const attendance = await Attendance.find({}).populate('classId','name').populate('studentId','name').sort({name:-1});
      
      if (!attendance || attendance.length === 0) {
        return sendNotFound(res, "No Attendance found");
      } else {
        return res.status(200).json(attendance);
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  export const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return sendNotFound(res, "attendance not found"); // Return ensures no further execution
        }

        // Delete the subject
        await Attendance.deleteOne({ _id: req.params.id });
        return sendDeleteSuccess(res, "Attendance deleted successfully"); // Send success response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
