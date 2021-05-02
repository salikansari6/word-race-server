const express = require('express');
const router = express.Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const { valid } = require('@hapi/joi');



router.post('/',async(req,res) =>{
  const token = req.header('auth-token')
  const {_id} = jwt.decode(token)
  const user = await User.findOne({_id:_id}) 
  res.json(user)
})

// register route
router.post('/register', async (req, res) => {
  // validate data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({message:error.details[0].message});

  // check if the user is already in the db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send({message:'Email already exists'});
  // hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const saveUser = await user.save();
    res.send({ user: user._id });
  } catch(err) {
    res.status(400).send(err);
  }
});

// login route
router.post('/login', async (req, res) => {
  // validate data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({message:error.details[0].message});

  // check if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({message:'Email is not found'});

  // password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send({message:'Invalid password'});

  // create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).json({token,userId:user._id});
});

module.exports = router;