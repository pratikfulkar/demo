
const BaseModel = require("./basemodel");
class Revenue extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				revenue_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				amount: {name: 'amount', type:Sequelize.DECIMAL},
				agent_id: {name: 'agent_id', type:Sequelize.INTEGER},
				patient_id: {name: 'patient_id', type:Sequelize.INTEGER},
				date_paid: {name: 'date_paid', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "revenue",
				modelName: "revenue",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'patient_id', 
			'date_paid'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'patient_id', 
			'date_paid'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'patient_id', 
			'date_paid'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'patient_id', 
			'date_paid'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'patient_id', 
			'date_paid'
		];
	}

	
	
}
module.exports = Revenue;
