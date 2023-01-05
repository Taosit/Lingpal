import { connectToDB } from "../../db/connect";
import { validateRoute } from "../../utils/helpers";

export default validateRoute(async (req, res, user) => {
  try {
    const { win, advanced } = req.body.data;
    const winScore = win? 1 : 0;
    const advancedScore = advanced? 1: 0;

    const { db } = await connectToDB()
    await db.collection('users').updateOne(
      { email: user.email },
      { $inc: { total: 1, win: winScore, advanced: advancedScore } }
    );
    return res.status(200).json({message: "User statistics are updated"});
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: "Something went wrong"})
  }
})