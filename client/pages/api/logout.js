import { connectToDB } from "../../db/connect";

export default async (req, res) => {
	const refreshToken = req.cookies?.jwt;
	if (!refreshToken) {
		return res.status(204).json({message: "You're logged out"})
	}
	res.setHeader('Set-Cookie', 'jwt=null; Max-Age=0');

	const { db } = await connectToDB()
	const user = await db.collection('users').findOne({ refreshToken })
	if (user.refreshToken) {
		await db.collection('users').updateOne({ refreshToken }, { $set: { refreshToken: "" } });
	}
	return res.status(204).json({message: "You're logged out"})
}