const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
require('../auth/passport')(passport);
const jwt = require('jsonwebtoken');
const Board = require('../models/Board');
const Card = require('../models/Card');
const User = mongoose.model('User')
const jwtoken = require("../auth/jwt")
/* GET home page. */
router.get('/', jwtoken.tokenVerify, async (req, res) => {
	try {
		const username = req.username;
		const user = await User.findOne({username:username}).populate('userboards');
		const boards = user.userboards;
		res.status(200).send(boards);
	}
	catch (err)
	{
		res.json({ message: err });
	}
});
router.get('/:id', jwtoken.tokenVerify, async (req, res) => {
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
router.post('/addBoard', jwtoken.tokenVerify, async (req, res) => {
	const board = new Board({
		title: req.body.field1,
		description: req.body.field2,
	});
	const username = req.username;
	try {
		const savedBoard = await board.save();
		const user = await User.findOne({username: username});
		await user.userboards.push(savedBoard._id);
		await user.save();
		res.status(200).send(savedBoard);
	}
	catch (err)
	{
		res.status(500).send({ message: err });
	}
});

router.post('/addCard/:id', jwtoken.tokenVerify, async (req, res) => {
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
		}
		if(req.body.type===2){
			await board.toImprove.push(savedCard._id);
		}
		if(req.body.type===3){
			await board.actionItems.push(savedCard._id);
		}
		await board.save();
		res.status(200).send({success: true, message:"Success Add"});
	}
	catch (err)
	{
		res.json({ message: err });
	}
});

router.post('/updateBoard/:id', jwtoken.tokenVerify, (req, res) => {
	const board = {
		title: req.body.field1,
		description: req.body.field2,
	};
	const id = req.params.id;
	const result = Board.findOneAndUpdate({_id:id}, board, (err, todo) => {
	// Handle any possible database errors
    if (err) return res.status(500).send(err);
    return res.status(200).send({success: true, message:"Updated"});
    } );

});

router.post('/updateCard/:id', jwtoken.tokenVerify, (req, res) => {
	const card = {
		subject: req.body.field1,
		content: req.body.field2,
	};
	const id = req.params.id;
	const result = Card.findOneAndUpdate({_id:id}, card, (err, todo) => {
	// Handle any possible database errors
    if (err) return res.status(500).send(err);
    return res.status(200).send({success: true, message:"Updated"});
    });
});

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, message: 'Please pass username and password.'});
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
    	if (err) {
    		return res.json({success: false, message: 'Username already exists.'});
    	}
    	jwt.sign({ username: newUser.username }, process.env.JWT_SECRET_OR_KEY, { expiresIn: '3600s' },(err, token) => {
			return res.status(200).json({
				success: true,
				token: token,	//return token and infomation user
				username: newUser.username
			})
		});
    });
  }
});
router.post('/signin', function(req, res) {
	User.findOne({
    	username: req.body.username
	}, function(err, user) {
    	if (err) throw err;

		if (!user) {
			res.status(401).send({success: false, message: 'Authentication failed. User not found.'});
		} else {
		// check if password matches
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
				// if user is found and password is right create a token
					jwt.sign({ username: user.username }, process.env.JWT_SECRET_OR_KEY, { expiresIn: '3600s' },(err, token) => {
						return res.status(200).json({
							success: true,
							token: token,	//return token and infomation user
							username: user.username
						})
					});
				} else {
					res.status(401).send({success: false, message: 'Authentication failed. Wrong password.'});
				}
			});
		}
	});
});
module.exports = router;