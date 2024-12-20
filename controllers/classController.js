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
        if(user.role !== 'teacher'){
    return  sendBadRequest(res,"user is not a teacher")
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
      const classes = await Class.find({}).sort({name:-1});
      
      if (!classes || classes.length === 0) {
        return sendNotFound(res, "No classes found");
      } else {
        return res.status(200).json(classes);
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };