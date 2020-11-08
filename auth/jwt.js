const jwt = require('jsonwebtoken');

exports.tokenVerify = (req, res, next) => {
	//get auth header value
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== 'undefined'){
		//split Bearer <access_token> from space
		const bearer = bearerHeader.split(' ');
		// Get token from array
		req.token = bearer[1];
		jwt.verify(req.token, process.env.JWT_SECRET_OR_KEY, (err, authData) => {
			if(err) {
				res.status(403).json({
					success: 0,
					message: "Invalid Token"
				});
			}else{
				req.username = authData.username;
				next();
			}
		});
	}else{
		res.status(403).json({
			success: 0,
			message: "Access denied! Unauthorization user"
		});
	}
}