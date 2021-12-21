/** Express router providing Users related routes
 * @module routers/Users
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
 * Form input validation module
 * @const
 */
const { body, validationResult } = require('express-validator');


/**
 * Users models
 * @const
 */
const models = require('../models/index.js');
const Users = models.Users;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators




/**
 * Route to list users records
 * @route {GET} /users/index/{fieldname}/{fieldvalue}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		let query = {};  // sequelize query object
		let where = {};  // sequelize where conditions
		let replacements = {};  // sequelize query params
		let fieldname = req.params.fieldname;
		let fieldvalue = req.params.fieldvalue;
		
		if (fieldname){
			where[Op.and] = [
				sequelize.literal(`(${fieldname} = :fieldvalue)`)
			];
			replacements.fieldvalue = fieldvalue;
		}
		let search = req.query.search;
		if(search){
			let searchFields = Users.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Users.getOrderBy(req);
		query.attributes = Users.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Users.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Users record
 * @route {GET} /users/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['user_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Users.viewFields();
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
 * Route to insert Users record
 * @route {POST} /users/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('first_name').not().isEmpty(),
		body('email').not().isEmpty().isEmail(),
		body('password').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('user_role_id').optional().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		modeldata.password = utils.passwordHash(modeldata.password);
		let first_nameCount = await Users.count({ where:{ 'first_name': modeldata.first_name } });
		if(first_nameCount > 0){
			return res.badRequest(`${modeldata.first_name} already exist.`);
		}
		let emailCount = await Users.count({ where:{ 'email': modeldata.email } });
		if(emailCount > 0){
			return res.badRequest(`${modeldata.email} already exist.`);
		}
		
		//save Users record
		let record = await Users.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['user_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Users record for edit
 * @route {GET} /users/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['user_id'] = recid;
		query.where = where;
		query.attributes = Users.editFields();
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
 * Route to update  Users record
 * @route {POST} /users/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('first_name').optional({nullable: true}).not().isEmpty(),
		body('last_name').optional(),
		body('telephone').optional({nullable: true}).not().isEmpty(),
		body('irda_code').optional(),
		body('photo').optional(),
		body('otp_code').optional(),
		body('user_role_id').optional().isNumeric(),
	]
, async (req, res) => {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let recid = req.params.recid;
		let modeldata = req.body;
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.photo, "photo");
			modeldata.photo = fileInfo.filepath;
		}
		let first_nameCount = await Users.count({where:{'first_name': modeldata.first_name, 'user_id': {[Op.ne]: recid} }});
		if(first_nameCount > 0){
			return res.badRequest(`${modeldata.first_name} already exist.`);
		}
		let query = {};
		let where = {};
		where['user_id'] = recid;
		query.where = where;
		query.attributes = Users.editFields();
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


/**
 * Route to delete Users record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /users/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['user_id'] = recid;
		query.where = where;
		let records = await Users.findAll(query);
		records.forEach(async (record) => { 
			await record.destroy();
			return res.ok(recid);
		});
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
