/** Express router providing Patient related routes
 * @module routers/Patient
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
 * Patient models
 * @const
 */
const models = require('../models/index.js');
const Patient = models.Patient;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators




/**
 * Route to list patient records
 * @route {GET} /patient/index/{fieldname}/{fieldvalue}
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
			let searchFields = Patient.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Patient.getOrderBy(req);
		query.attributes = Patient.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Patient.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Patient record
 * @route {GET} /patient/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['patient_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Patient.viewFields();
		let record = await Patient.findOne(query);
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
 * Route to insert Patient record
 * @route {POST} /patient/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('first_name').optional(),
		body('last_name').optional(),
		body('phone_number').optional(),
		body('category').optional(),
		body('amount').optional().isNumeric(),
		body('policy_doc').optional(),
		body('hospital_invoice').optional(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.policy_doc !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.policy_doc, "policy_doc");
			modeldata.policy_doc = fileInfo.filepath;
		}
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.hospital_invoice !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.hospital_invoice, "hospital_invoice");
			modeldata.hospital_invoice = fileInfo.filepath;
		}
		modeldata['status'] = "New";
modeldata['agent_id'] = req.user.user_id;
modeldata['date_added'] = utils.dateTimeNow();
		
		//save Patient record
		let record = await Patient.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['patient_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Patient record for edit
 * @route {GET} /patient/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['patient_id'] = recid;
		query.where = where;
		query.attributes = Patient.editFields();
		let record = await Patient.findOne(query);
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
 * Route to update  Patient record
 * @route {POST} /patient/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('first_name').optional(),
		body('last_name').optional(),
		body('phone_number').optional(),
		body('category').optional(),
		body('amount').optional().isNumeric(),
		body('policy_doc').optional(),
		body('hospital_invoice').optional(),
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
		if(modeldata.policy_doc !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.policy_doc, "policy_doc");
			modeldata.policy_doc = fileInfo.filepath;
		}
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.hospital_invoice !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.hospital_invoice, "hospital_invoice");
			modeldata.hospital_invoice = fileInfo.filepath;
		}
		let query = {};
		let where = {};
		where['patient_id'] = recid;
		query.where = where;
		query.attributes = Patient.editFields();
		let record = await Patient.findOne(query);
		if(record){
			await Patient.update(modeldata, {where: where});
			return res.ok(modeldata);
		}
		return res.notFound();
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Patient record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /patient/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['patient_id'] = recid;
		query.where = where;
		let records = await Patient.findAll(query);
		records.forEach(async (record) => { 
			await record.destroy();
			return res.ok(recid);
		});
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to list patient records
 * @route {GET} /patient/index/{fieldname}/{fieldvalue}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/revenue/:fieldname?/:fieldvalue?'], async (req, res) => {  
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
			let searchFields = Patient.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Patient.getOrderBy(req);
		query.attributes = Patient.revenueFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Patient.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});
module.exports = router;
