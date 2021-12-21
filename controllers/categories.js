/** Express router providing Categories related routes
 * @module routers/Categories
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
 * Categories models
 * @const
 */
const models = require('../models/index.js');
const Categories = models.Categories;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators




/**
 * Route to list categories records
 * @route {GET} /categories/index/{fieldname}/{fieldvalue}
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
			let searchFields = Categories.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Categories.getOrderBy(req);
		query.attributes = Categories.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Categories.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Categories record
 * @route {GET} /categories/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['category'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Categories.viewFields();
		let record = await Categories.findOne(query);
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
 * Route to insert Categories record
 * @route {POST} /categories/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('category').not().isEmpty(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Categories record
		let record = await Categories.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['category'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Categories record for edit
 * @route {GET} /categories/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['category'] = recid;
		query.where = where;
		query.attributes = Categories.editFields();
		let record = await Categories.findOne(query);
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
 * Route to update  Categories record
 * @route {POST} /categories/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('category').optional({nullable: true}).not().isEmpty(),
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
		where['category'] = recid;
		query.where = where;
		query.attributes = Categories.editFields();
		let record = await Categories.findOne(query);
		if(record){
			await Categories.update(modeldata, {where: where});
			return res.ok(modeldata);
		}
		return res.notFound();
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Categories record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /categories/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['category'] = recid;
		query.where = where;
		let records = await Categories.findAll(query);
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
