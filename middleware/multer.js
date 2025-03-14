import multer from "multer";
import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary";

import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_SECRET_KEY,
})
const storage =new CloudinaryStorage ({
  cloudinary,params:{
    folder:"user-profiles",
    allowed_format:['jpg','jpeg','png']
  }
})

const upload = multer({storage})
 export{upload,cloudinary}
