import { cloudinary } from "../../db/cloudinary";
import { connectToDB } from "../../db/connect";
import { validateRoute } from "../../utils/helpers";

export default validateRoute(async (req, res, user) => {
  try {
    const fileStr = req.body.data;
		const uploadResponse = await cloudinary.uploader.upload(fileStr, {
			upload_preset: "ml_default",
		});
    const { db } = await connectToDB()
		await db.collection('users').updateOne(
			{ email: user.email },
			{ $set: { avatar: uploadResponse.public_id } }
		);
		return res.status(200).json({ id: uploadResponse.public_id });
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: "Something went wrong"})
  }
})