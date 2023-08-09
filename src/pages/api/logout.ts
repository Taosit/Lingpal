import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../db/connect";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    return res.status(204).json({ message: "You're logged out" });
  }
  res.setHeader("Set-Cookie", "jwt=null; Max-Age=0");

  const { db } = await connectToDB();
  const user = await db.collection("users").findOne({ refreshToken });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.refreshToken) {
    await db
      .collection("users")
      .updateOne(
        { refreshToken },
        { $set: { refreshToken: "", lastLogin: null } }
      );
  }
  return res.status(204).json({ message: "You're logged out" });
};

export default handler;
