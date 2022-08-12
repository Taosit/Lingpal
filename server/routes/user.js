const express = require("express");
const { cloudinary } = require("../utils/cloudinary");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const User = require("../model/User");

router.post("/upload-image", verifyUser, async (req, res) => {
	try {
		const fileStr = req.body.data;
		const uploadResponse = await cloudinary.uploader.upload(fileStr, {
			upload_preset: "ml_default",
		});
		await User.findOneAndUpdate(
			{ email: req.userEmail },
			{ $set: { avatar: uploadResponse.public_id } }
		);
		res.status(200).json({ id: uploadResponse.public_id });
	} catch (err) {
		console.error(err);
		res.status(500).json({ err: "Something went wrong" });
	}
});

router.post("/update-stats", verifyUser, async (req, res) => {
	try {
		const { win, advanced } = req.body.data;
		if (win && advanced) {
			await User.findOneAndUpdate(
				{ email: req.userEmail },
				{ $inc: { total: 1, win: 1, advanced: 1 } }
			);
		} else if (win) {
			await User.findOneAndUpdate(
				{ email: req.userEmail },
				{ $inc: { total: 1, win: 1 } }
			);
		} else if (advanced) {
			await User.findOneAndUpdate(
				{ email: req.userEmail },
				{ $inc: { total: 1, advanced: 1 } }
			);
		} else {
			await User.findOneAndUpdate(
				{ email: req.userEmail },
				{ $inc: { total: 1 } }
			);
		}
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
	}
});

module.exports = router;
