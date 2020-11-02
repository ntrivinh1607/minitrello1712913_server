const mongoose = require('mongoose');

const CardSchema = mongoose.Schema({
	subject:{
		type: String,
		require: true,
	},
	content:{
		type: String,
		require: true,
	},
	date:{
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model('Card', CardSchema);