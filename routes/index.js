const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Card = require('../models/Card');
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
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const boards = await Board.findById(id).populate('wentWell').populate('toImprove').populate('actionItems');
		res.status(200).send(boards);
	}
	catch (err)
	{
		res.json({ message: err });
	}
});

//POST
router.post('/addBoard', async (req, res) => {
	const board = new Board({
		title: req.body.field1,
		description: req.body.field2,
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

router.post('/addCard/:id', async (req, res) => {
	try {
		const card = new Card({
			subject: req.body.field1,
			content: req.body.field2,
		});
		const id = req.params.id;
		const board = await Board.findById(id);
		const savedCard = await card.save();
		if(req.body.type===1){
			await board.wentWell.push(savedCard._id);
			const savedBoard = await board.save();
		}
		else
		{
			if(req.body.type===2){
				await board.toImprove.push(savedCard._id);
				const savedBoard = await board.save();
			}
			else
			{
				if(req.body.type===3){
					await board.actionItems.push(savedCard._id);
					const savedBoard = await board.save();
				}
				else{
					res.sendStatus(500);
				}
			}
		}
		res.status(200).send(savedBoard);
	}
	catch (err)
	{
		res.json({ message: err });
	}
});

module.exports = router;