import { connectToDB } from "../../db/connect";
import { validateRoute } from "../../utils/helpers";

export default validateRoute(async (req, res, user) => {
  try {
    const username = req.body.data;
    if (username.length < 3 || username.length > 10) {
      return res.status(400).json({message: "Username must be between 3 and 10 characters"})
    }
    const { db } = await connectToDB()
		await db.collection('users').updateOne(
			{ email: user.email },
			{ $set: { username } }
		);
		return res.status(200).json({ username });
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: "Something went wrong"})
  }
})