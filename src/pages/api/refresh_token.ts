import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../db/connect";
import jwt, { Secret } from "jsonwebtoken";
import { getSafeUser } from "@/utils/helpers";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(
      "Missing env variable REFRESH_TOKEN_SECRET or ACCESS_TOKEN_SECRET"
    );
  }
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unable to refresh token" });
  }

  const { db } = await connectToDB();
  const user = await db.collection("users").findOne({ refreshToken });
  await db
    .collection("users")
    .updateOne({ refreshToken }, { $set: { lastLogin: new Date() } });
  if (!user) {
    return res.status(401).json({ message: "Unable to refresh token" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (typeof decoded !== "object" || !decoded.email) {
      return res.status(401).json({ message: "Unable to refresh token" });
    }
    if (err || decoded.email !== user.email) {
      return res.status(401).json({ message: "Unable to refresh token" });
    }
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: "2h" }
    );
    return res.status(200).json({ accessToken, user: getSafeUser(user) });
  });
};

export default handler;
