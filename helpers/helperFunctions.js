import bcrypt from 'bcrypt'
export const hashPassword= async(Password)=>{
    return await bcrypt.hash(Password,8);
}

export const sendServerError=(res,message)=>{
    return res.status(500).json({message:message})
}

export const sendBadRequest = (res, message) => {
    return res.status(400).json({ message: message });
}

export const sendNotFound = (res, message) => {
    return res.status(404).json({ message: message });
}

export const sendCreated = (res, message) => {
    return res.status(201).json({ message: message });
}
export const sendDeleteSuccess = (res, message) => {
    return res.status(200).json({ message: message });
}

export const sendSuccess = (res, message) => {
    return res.status(200).json({ message: message });
}
export const notAuthorized = (res, message) => {
    return res.status(401).json({ message: message });
}

export const forbidden=(res,message)=>{
    return res.status(403).json({message:message})
}