/** Express router providing user account related routes
 * @module routers/account
 * @requires express
 * @requires config - app config
 * @requires utils - app utils functions
 * @requires express-validator - form validation module
 * @requires models- app model module
 */


 /**
 * express module
 * @const
 */
const express = require('express');


/**
 * Express router to mount user page functions.
 * @type {object}
 * @const
 */
const router = express.Router();


/**
 * App utils functions module
 * @const
 */
const utils = require('../helpers/utils.js');


/**
 * App config module
 * @const
 */
const config = require('../config.js');


/**
 * Form input validation module
 * @const
 */
const { body, validationResult } = require('express-validator');


/**
 *  models
 * @const
 */
const models = require('../models/index.js');
const Users = models.Users;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators


/**
 * Route to view user account record
 * @route {GET} /account
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/','/index'], async (req, res) => {
	try{
		let userId = req.user.user_id;
		let query = {
			where: {user_id: userId }
		}
		query.attributes = Users.accountviewFields();
		query.raw = true;
		let record = await Users.findOne(query);
		if(record){
			return res.ok(record);
		}
		return res.notFound();
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  user account record for edit
 * @route {GET} /account/edit
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit', async (req, res) => {
	try{
		let userId = req.user.user_id;
		let query = {
			where: {user_id: userId }
		}
		query.attributes = Users.accounteditFields();
		query.raw = true;
		let record = await Users.findOne(query);
		if(record){
			return res.ok(record);
		}
		return res.badRequest("No record found");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  user account record
 * @route {POST} /account/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit' , 
	[
		body('first_name').optional(),
		body('last_name').optional(),
		body('telephone').optional({nullable: true}).not().isEmpty(),
		body('photo').optional(),
		body('user_role_id').optional().isNumeric(),
	]
, async (req, res) => {
	try{
		// Finds the validation errors in this request and wraps them in an object with handy functions
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let recid = req.user.user_id;
		let modeldata = req.body;
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.photo, "photo");
			modeldata.photo = fileInfo.filepath;
		}
		let query = {}
		let where =  {user_id: recid }
		query.where = where;
		query.attributes = Users.accounteditFields();
		query.raw = true;
		let record = await Users.findOne(query);
		if(record){
			await Users.update(modeldata, {where: where});
			return res.ok(modeldata);
		}
		return res.notFound();
	}
	catch(err){
		return res.serverError(err);
	}
});
router.get('/currentuserdata', async function (req, res)
{
	let user = req.user;
    return res.ok(user);
});


/**
 * Route to change user password
 * @route {POST} /account
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.post('/changepassword' , 
	[
		body('oldpassword').not().isEmpty(),
		body('newpassword').not().isEmpty(),
		body('confirmpassword').not().isEmpty().custom((value, {req}) => (value === req.body.newpassword))
	]
, async function (req, res) {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let oldPassword = req.body.oldpassword;
		let newPassword = req.body.newpassword;
		let query = {}
		let where =  {user_id:  req.user.user_id};
		query.where = where;
		query.attributes = ['password'];
		query.raw = true;
		let user = await Users.findOne(query);
		let currentPasswordHash = user.password;
		if(!utils.passwordVerify(oldPassword, currentPasswordHash)){
			return res.badRequest("Current password is incorrect");
		}
		let modeldata = {
			password: utils.passwordHash(newPassword)
		}
		await Users.update(modeldata, {where: where});
		return res.ok("Password change completed");
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
