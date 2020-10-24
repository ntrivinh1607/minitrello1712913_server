const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

/* GET home page. */
router.get('/', async (req, res) => {
	try {
		const boards = await Board.find();
		res.status(200).send(boards);
	}
	catch (err)
	{
		res.json({ message: err });
	}
});

//POST
router.post('/', async (req, res) => {
	const board = new Board({
		title: req.body.title,
		description: req.body.description,
	});
	try {
		const savedBoard = await board.save();
		res.status(200).send(savedBoard);
	}
	catch (err)
	{
		res.status(500).send({ message: err });
	}
});

module.exports = router;
