import { forbidden, sendBadRequest, sendServerError } from "../helpers/helperFunctions.js"

export const checkUser = (req,res,next) =>{
    try {
        if (!req.user) {
            console.log("first")
         return forbidden(res,"Not Authorized")
        }
         if(req.user?.role !== "admin" && req.user?.role !== "teacher") {
            console.log("here")
            return forbidden (res,"Acces Denied")
        }
        return next()
    } catch (error) {
        return sendServerError(res,"Server Error")
    }
}