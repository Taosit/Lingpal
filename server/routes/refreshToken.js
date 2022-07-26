const express = require("express");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", async (req, res) => {
	const refreshToken = req.cookies?.jwt;
	console.log(req.cookies);
	if (!refreshToken) return res.sendStatus(401);

	const user = await User.findOne({ refreshToken });
	if (!user) return res.sendStatus(403);
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || decoded.email !== user.email) return res.sendStatus(403);
		console.log("getting new access token");
		const accessToken = jwt.sign(
			{ username: decoded.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "60s" }
		);
		res.status(200).json({ accessToken });
	});
});

module.exports = router;
