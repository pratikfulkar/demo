/** Express router providing related routes to page component data
 * @module routers/components_data
 * @requires express
 * @requires config - app config
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
 *  models
 * @const
 */
const models = require('../models/index.js');


const sequelize = models.sequelize;
const Op = models.Op; // sequelize query operators


 /**
 * Route to check if field value already exist in a Users table
 * @route {GET} /components_data/users_first_name_exist/{fieldvalue}
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/users_first_name_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await models.Users.count({ where:{ 'first_name': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get user_role_id_option_list records
 * @route {GET} /components_data/user_role_id_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/user_role_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT role_id as value, role_id as label FROM roles` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @route {GET} /components_data/users_email_exist/{fieldvalue}
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/users_email_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await models.Users.count({ where:{ 'email': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get category_option_list records
 * @route {GET} /components_data/category_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/category_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT category AS value,category AS label FROM categories ORDER BY category ASC` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get role_id_option_list records
 * @route {GET} /components_data/role_id_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/role_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT role_id as value, role_name as label FROM roles` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get patient_data_component records
 * @route {GET} /components_data/patient_data_component
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/patient_data_component', async (req, res) => {
	try{
		let sqltext = `select 
(select count(*) from patient where status='New') as newcount, 
(select count(*) from patient where status='Disburssed') as disburssedcount,
(select count(*) from patient where status='In Progress') as inprogresscount` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get patient_data_component_2 records
 * @route {GET} /components_data/patient_data_component_2
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/patient_data_component_2', async (req, res) => {
	try{
		let sqltext = `select 
(select sum(amount) from patient where extract(month FROM date_added)=extract(month FROM CURRENT_DATE)) as current_month, 
(select sum(amount) from patient where extract(year FROM date_added)=extract(year FROM CURRENT_DATE)) as current_year,
(select sum(amount) from patient) as total` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get barchart_revenueoverview records
 * @route {GET} /components_data/barchart_revenueoverview
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/barchart_revenueoverview',  async (req, res) => {
	let chartData = { labels:[], datasets:[] };
	try{
		let sqltext = `SELECT 
sum(amount) as amount, 
TO_CHAR(date_added, 'Month') AS month,
EXTRACT(YEAR FROM date_added) AS year
FROM patient 
group by year, month
order by TO_CHAR(date_added, 'Month')` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		chartData['labels'] = records.map(function(v){ return v.month });
		let dataset1 = {
			data: records.map(function(v){ return parseFloat(v.amount) }),
			label: ""
		};
		chartData.datasets.push(dataset1);
		return res.ok(chartData) ;
	}
	catch(err) {
		return res.serverError(err);
	}
});


 /**
 * Route to get home_data_component records
 * @route {GET} /components_data/home_data_component
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/home_data_component', async (req, res) => {
	try{
		let sqltext = `SELECT (SELECT COUNT(*) AS num FROM patient) as totalpatient, (SELECT COUNT(*) AS num FROM patient where status='New') as newpatient` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get home_data_component_sum records
 * @route {GET} /components_data/home_data_component_sum
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/home_data_component_sum', async (req, res) => {
	try{
		let sqltext = `SELECT (SELECT SUM(amount) AS num FROM patient) as totalrevenue, (SELECT SUM(amount) AS num FROM patient where extract (month FROM date_added)=extract (month FROM CURRENT_DATE)) as revenue_this_month` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get barchart_patientreferred records
 * @route {GET} /components_data/barchart_patientreferred
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/barchart_patientreferred',  async (req, res) => {
	let chartData = { labels:[], datasets:[] };
	try{
		let sqltext = `SELECT 
sum(amount) AS totalrevenue,
extract(dow from date_added) AS dayofweek
FROM patient 
where date_added > CURRENT_DATE - 7
group by dayofweek
order by dayofweek` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		chartData['labels'] = records.map(function(v){ return v.dayofweek });
		let dataset1 = {
			data: records.map(function(v){ return parseFloat(v.totalrevenue) }),
			label: ""
		};
		chartData.datasets.push(dataset1);
		return res.ok(chartData) ;
	}
	catch(err) {
		return res.serverError(err);
	}
});
module.exports = router;
