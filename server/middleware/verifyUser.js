const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyUser = async (req, res, next) => {
	console.log(req.headers.authorization);
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer")
	) {
		res.sendStatus(401);
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		console.log({ token });
		if (!token) {
			res.sendStatus(401);
		}
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		console.log({ decoded });
		const user = await User.findOne({ email: decoded.email });
		req.userEmail = user.email;
		next();
	} catch (error) {
		console.log(error);
		res.sendStatus(403);
	}
};

module.exports = verifyUser;
