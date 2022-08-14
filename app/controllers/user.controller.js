const { valideUserInput } = require('../helpers/valideUserInput');
const { generateToken } = require('../helpers/jwt');

const model = require("../models");
const Boom = require('@hapi/boom');
const User = model.user;
const register =  async (req, res) => {
  try {
    if (!req.body) {
      res.json(Boom.badRequest("Content can not be empty!"))
      return;
    }
  
    const { name, password, email } = req.body;
    const user = await User.findOne({where: { email }});
    if (user) res.json(Boom.badData('User is exists'));
  
    const userCreate = await User.create({ name, password, email });
    const accessToken = await generateToken({ user: userCreate });
  
    return res.json({accessToken});
  } catch (error) {
    return res.json(Boom.badRequest(`User Register failed..! >> ${error}`));
  }
};

const login = async (req, res) => {
try {
  const { email, password } = req.body;
  if (!valideUserInput(email, password)) {
    return res.json(Boom.badRequest("Please check your password.!"));
  }
  const user = await User.findOne({where: { email }});
  if (!user.validPassword(password, user.password)) {
    return res.json(Boom.badRequest("Please check your password.!"));
  }
  const accessToken = await generateToken({ user });

  return res.json({accessToken});
} catch (error) {
  return res.json(Boom.badRequest(`User Login failed..! >> ${error}`));
}
};

module.exports = {
  register,
  login
}

