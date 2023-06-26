import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../db/connect";
import jwt from "jsonwebtoken";
import { getSafeUser } from "@/utils/helpers";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unable to refresh token" });
  }

  const { db } = await connectToDB();
  const user = await db.collection("users").findOne({ refreshToken });
  if (!user) {
    return res.status(401).json({ message: "Unable to refresh token" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.email !== user.email) {
      return res.status(401).json({ message: "Unable to refresh token" });
    }
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    return res.status(200).json({ accessToken, user: getSafeUser(user) });
  });
};

export default handler;
