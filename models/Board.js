const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Card = require('./Card.js');


const BoardSchema = Schema({
	title:{
		type: String,
		required: true,
		unique: true,
		minlength: 3,
	},
	description:{
		type: String,
		required: true,
	},
	date:{
		type: Date,
		default: Date.now,
	},
	wentWell: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
	toImprove: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
	actionItems: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
	isDelete:{
		type: Boolean,
		default: 0,
	},
});
module.exports = mongoose.model('Board', BoardSchema);