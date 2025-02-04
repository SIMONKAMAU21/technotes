import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const generateToken = (id,role,name) => {
  return jwt.sign({ id ,role,name }, process.env.JWT_SECRET, {
    expiresIn: '2hrs',
  })
}

export default generateToken