import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { connectToDB } from "../../db/connect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password must be filled" });
  }
  const { db } = await connectToDB();
  const user = await db.collection("users").findOne({ email: email });
  const match = await bcrypt.compare(password, user?.password || "0");
  if (!user || !match) {
    return res.status(401).json({ message: "Incorrect credentials" });
  }
  const { refreshToken, password: databasePassword, ...userCopy } = user;

  const accessToken = jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" }
  );
  const newRefreshToken = jwt.sign(
    { email: email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  await db
    .collection("users")
    .updateOne({ email }, { $set: { refreshToken: newRefreshToken } });
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );
  return res.status(200).json({ accessToken, user: userCopy });
};

export default handler;
