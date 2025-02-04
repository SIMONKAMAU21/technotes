import { forbidden } from "../helpers/helperFunctions.js"

export const checkAdmin = (req, res, next) => {

    try {
        if (!req.user) {
            return forbidden(res, "Not authorized")
        }
        if (req.user?.role !== 'admin') {
            return forbidden(res, "Access denied")
        }
        return next()
    } catch (error) {
        console.warn('error', error)
    }
}