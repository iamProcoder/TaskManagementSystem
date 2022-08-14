const JWT = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const generateToken = (data) => {
    return new Promise((resolve, reject) => {
		const payload = {
			...data,
		};

		const options = {
			expiresIn: "3h",
			issuer: "task-management-system",
		};

		JWT.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
			if (err) {
				console.log(err);
				reject(Boom.forbidden(err.message));
			}

			resolve(token);
		});
	});
};

const verifyToken = (req, res, next) => {	
	const authorization = req.headers.authorization;
	const err = Boom.unauthorized('Not Authorized to Access');
	if (!authorization) return res.json(err)

	const access_token = authorization.split(" ")[1];
	JWT.verify(access_token, process.env.JWT_SECRET, (err, payload) => {
		if (err) return res.json(Boom.forbidden());
	
		req.activeUser = payload;
		next();
	});

};

module.exports = {
  generateToken,
  verifyToken
};