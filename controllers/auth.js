/** Express router providing user authentication routes
 * @module routers/account
 * @requires express
 * @requires config - app config
 * @requires utils - app utils functions
 * @requires express-validator - form validation module
 * @requires models- app model module
 */
const express = require('express');


 /**
 * express module
 * @const
 */
const router = express.Router();


 /**
 * bycrypt module
 * @const
 */
const bcrypt = require('bcryptjs');


 /**
 * passport module
 * @const
 */
const passport = require('passport');


 /**
 * App config module
 * @const
 */
const config = require('../config.js');


 /**
 * App utils functions module
 * @const
 */
const utils = require('../helpers/utils.js');


 /**
 * JWT module
 * @const
 */
const jwt = require('jsonwebtoken');


 /**
 * Form input validation module
 * @const
 */
const { body, validationResult } = require('express-validator');


const models = require('../models/index.js');
const Users = models.Users;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators


/**
 * Generate jwt token
 * @param {string} userId - current user id
 * @param {string} expiresIn - token expiration duration
 */
function generateToken(userId, expiresIn){
	let token = jwt.sign({sub: userId}, config.app.secret, {expiresIn: expiresIn });
	return token;
}


/**
 * Return user login data
 * @param {object} user - current user
 */
async function getUserLoginData(user){
	// generate a signed jwt with user id
	let userId = user.user_id
	let token = generateToken(userId, "2h"); //generate token duration
	return {user, token}; //return user object and token
}


/**
 * Route to login user using credential
 * @route {POST} /auth/login
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/login', [
		body('username').not().isEmpty(),
		body('password').not().isEmpty(),
	], async (req, res, next) => {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let {username, password} = req.body;
		let user = await Users.findOne({where: { 'email': username}});
		if(!user){
			return res.unauthorized("Username or password not correct");
		}
		let passwordHash = user.password;
		if(!utils.passwordVerify(password, passwordHash)){
			return res.unauthorized("Username or password not correct");
		}
		let loginData = await getUserLoginData(user);
		return res.ok(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to register new user
 * @route {POST} /auth/register
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/register', 
	[
		body('first_name').not().isEmpty(),
		body('last_name').optional(),
		body('telephone').not().isEmpty(),
		body('irda_code').optional(),
		body('user_role_id').optional().isNumeric(),
	]
, async function (req, res) {
	try{
		// Finds the validation errors in this request and convert to specific format
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		let first_nameCount = await Users.count({ where:{ 'first_name': modeldata.first_name } });
		if(first_nameCount > 0){
			return res.badRequest(`${modeldata.first_name} already exist.`);
		}
		let record = user = await Users.create(modeldata); // user record
		await user.reload();
		let recid =  record['user_id'];
		
		let loginData = await getUserLoginData(user);
		return res.ok(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to send password reset link to user email
 * @route {POST} /auth/forgotpassword
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/forgotpassword', [
		body('email').not().isEmpty().isEmail(),
	], async (req, res) => {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let email = req.body.email;
		let user = await Users.findOne({where: { 'email': email} });
		if(user){
			let userid = user.user_id
			let token = generateToken(userid, "15m");
			let resetlink = config.app.frontendUrl +  "/#/index/resetpassword?token=" + token;
			let username = user.first_name;
			let mailtitle = 'password reset';
			let ejs = require('ejs');
			let templateOptions = {username, email, resetlink, config};
			let mailbody = await ejs.renderFile("views/pages/index/password_reset_email_template.ejs", templateOptions);
			let mailer = require('../helpers/mailer.js');
			let mailResult = await mailer.sendMail(email, mailtitle, mailbody);
			if(mailResult.messageId){
				return res.ok("We have emailed your password reset link!");
			}
			else{
				return res.serverError(mailResult.error);
			}
		}
		return res.notFound("Email not registered");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to reset user password
 * @route {POST} /auth/resetpassword
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/resetpassword', [
		body('password').not().isEmpty().custom((val, { req, loc, path }) => {
			if (val !== req.body.confirm_password) {
				throw new Error("Passwords confirmation does not match");
			} else {
				return val;
			}
        }),
	],  async (req, res) => {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let token = req.body.token;
		jwt.verify(token, config.app.secret, async (err, decoded) => {
			if (err){
				return res.status(422).send(err);
			}
			let userid = decoded.sub;
			let password = req.body.password;
			let where = {user_id: userid }
			let record = await Users.findOne({where: where})
			if(record){
				var newPassword = bcrypt.hashSync(password, 10);
				var modeldata = {password: newPassword}
				let rowsUpdated = await Users.update(modeldata, {where: where});
				return res.ok("Password changed");
			}
			return res.notFound("User not found");
		});
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
