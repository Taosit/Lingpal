import { connectToDB } from "../db/connect"

export const validateRoute = (handler) => {
  return async (req, res) => {
    const refreshToken = req.cookies.jwt
    if (!refreshToken) {
      return res.status(401).json({message: "Access forbiden"})
    }
    const { db } = await connectToDB()
    const user = await db.collection('users').findOne({ refreshToken })
    if (!user) {
      return res.status(401).json({message: "Access forbiden"})
    }
    return handler(req, res, user)
  }
}