const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		console.log(process.env.DATABASE_URI);
		await mongoose.connect(process.env.DATABASE_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDb;
