const express = require("express");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", async (req, res) => {
	const refreshToken = req.cookies?.jwt;
	if (!refreshToken) return res.sendStatus(401);

	const user = await User.findOne({ refreshToken });
	if (!user) return res.sendStatus(403);
	const userCopy = { ...user._doc, password: null };
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || decoded.email !== user.email) return res.sendStatus(403);
		console.log("getting new access token");
		const accessToken = jwt.sign(
			{ email: decoded.email },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "2h" }
		);
		res.status(200).json({ accessToken, user: userCopy });
	});
});

module.exports = router;
