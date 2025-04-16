import { sendServerError } from "../helpers/helperFunctions.js";

export const errorHandler = (err, req, res, next) => {
//   console.error(`path:${req.path}`, err.stack);
  sendServerError(res, "Internal Server Error");
}