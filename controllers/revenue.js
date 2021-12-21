/** Express router providing Revenue related routes
 * @module routers/Revenue
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
 * Revenue models
 * @const
 */
const models = require('../models/index.js');
const Revenue = models.Revenue;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators




/**
 * Route to list revenue records
 * @route {GET} /revenue/index/{fieldname}/{fieldvalue}
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
			let searchFields = Revenue.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Revenue.getOrderBy(req);
		query.attributes = Revenue.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Revenue.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Revenue record
 * @route {GET} /revenue/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['revenue_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Revenue.viewFields();
		let record = await Revenue.findOne(query);
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
 * Route to insert Revenue record
 * @route {POST} /revenue/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('amount').not().isEmpty(),
		body('agent_id').optional().isNumeric(),
		body('patient_id').optional().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		modeldata['date_paid'] = utils.datetimeNow();
		
		//save Revenue record
		let record = await Revenue.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['revenue_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Revenue record for edit
 * @route {GET} /revenue/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['revenue_id'] = recid;
		query.where = where;
		query.attributes = Revenue.editFields();
		let record = await Revenue.findOne(query);
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
 * Route to update  Revenue record
 * @route {POST} /revenue/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('amount').optional({nullable: true}).not().isEmpty(),
		body('agent_id').optional().isNumeric(),
		body('patient_id').optional().isNumeric(),
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
		let query = {};
		let where = {};
		where['revenue_id'] = recid;
		query.where = where;
		query.attributes = Revenue.editFields();
		let record = await Revenue.findOne(query);
		if(record){
			await Revenue.update(modeldata, {where: where});
			return res.ok(modeldata);
		}
		return res.notFound();
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Revenue record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /revenue/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['revenue_id'] = recid;
		query.where = where;
		let records = await Revenue.findAll(query);
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
