const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/", async (req, res) => {
	const refreshToken = req.cookies?.jwt;
	if (!refreshToken) return res.sendStatus(204);
	res.clearCookie("jwt", { httpOnly: true });

	const user = await User.findOne({ refreshToken });
	if (!user?.refreshToken) return res.sendStatus(204);
	await User.updateOne({ refreshToken }, { $set: { refreshToken: "" } });
	res.sendStatus(204);
});

module.exports = router;
