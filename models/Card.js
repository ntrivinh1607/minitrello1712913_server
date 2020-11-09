const mongoose = require('mongoose');

const CardSchema = mongoose.Schema({
	subject:{
		type: String,
		unique: true,
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
	isDelete:{
		type: Boolean,
		default: 0,
	},
});
module.exports = mongoose.model('Card', CardSchema);