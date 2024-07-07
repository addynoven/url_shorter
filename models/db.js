const { default: mongoose } = require("mongoose");

mongoose
	.connect(process.env.MONGO_URL)
	.then((value) => {
		console.log("db connected...");
	})
	.catch((err) => {
		console.log(err);
	});
