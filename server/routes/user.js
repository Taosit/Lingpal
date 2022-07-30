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
		res.json({ id: uploadResponse.public_id });
	} catch (err) {
		console.error(err);
		res.status(500).json({ err: "Something went wrong" });
	}
});

module.exports = router;
