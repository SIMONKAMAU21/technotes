import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { notAuthorized } from '../helpers/helperFunctions.js'

dotenv.config()
export const Auth = (req, res, next) => {

    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] === "JWT") {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.JWT_SECRET,
            (err, decode) => {
                if (err) {
                    return notAuthorized(res, "please login or create account")
                } else {
                    req.user = decode;
                    next()
                }
            }
        )
    } else {
        return notAuthorized(res, "Access denied")
    }
}