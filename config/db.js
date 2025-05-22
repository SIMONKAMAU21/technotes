import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.warn(`Mongodb db connect as a demo for mark to understand backend and frontend ${connect.connection.host}`);
  } catch (error) {
    console.error(`error : ${error.message}`);
    process.exit(1);
  }
};
export default { connectDb };
