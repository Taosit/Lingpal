import { connectToDB } from "../../db/connect";
import jwt from "jsonwebtoken";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unable to refresh token" });
  }

  const { db } = await connectToDB();
  const user = await db.collection("users").findOne({ refreshToken });
  if (!user) {
    return res.status(401).json({ message: "Unable to refresh token" });
  }
  const { password, ...userCopy } = user;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.email !== user.email) {
      return res.status(401).json({ message: "Unable to refresh token" });
    }
    console.log("getting new access token");
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    return res.status(200).json({ accessToken, user: userCopy });
  });
};
