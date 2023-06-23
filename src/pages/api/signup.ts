import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { nanoid } from "nanoid";
import { connectToDB } from "../../db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getSafeUser } from "@/utils/helpers";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Incomplete fields" });
  }
  const { db } = await connectToDB();

  const duplicateUsername = await db.collection("users").findOne({ username });
  if (duplicateUsername) {
    return res.status(409).json({ message: "Username is taken" });
  }
  const duplicateEmail = await db.collection("users").findOne({ email });
  if (duplicateEmail) {
    return res.status(409).json({ message: "This email is already registed" });
  }
  const hashedPwd = await bcrypt.hash(password, 10);

  const accessToken = jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" }
  );
  const refreshToken = jwt.sign(
    { email: email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const user = {
    _id: nanoid(),
    username,
    email,
    password: hashedPwd,
    refreshToken,
    total: 0,
    win: 0,
    advanced: 0,
    avatar: "nruwutqaihxyl7sq6ilm",
  };
  await db.collection("users").insertOne(user);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );
  return res.status(200).json({ accessToken, user: getSafeUser(user) });
};

export default handler;
