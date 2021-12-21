
const BaseModel = require("./basemodel");
class Patient extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				patient_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				first_name: {name: 'first_name', type:Sequelize.STRING},
				last_name: {name: 'last_name', type:Sequelize.STRING},
				phone_number: {name: 'phone_number', type:Sequelize.STRING},
				policy_doc: {name: 'policy_doc', type:Sequelize.STRING},
				hospital_invoice: {name: 'hospital_invoice', type:Sequelize.STRING},
				status: {name: 'status', type:Sequelize.STRING},
				photo: {name: 'photo', type:Sequelize.STRING},
				category: {name: 'category', type:Sequelize.STRING},
				agent_id: {name: 'agent_id', type:Sequelize.INTEGER},
				amount: {name: 'amount', type:Sequelize.DECIMAL},
				date_added: {name: 'date_added', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "patient",
				modelName: "patient",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'photo', 
			'category', 
			'agent_id', 
			'amount', 
			'date_added'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'photo', 
			'category', 
			'agent_id', 
			'amount', 
			'date_added'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'photo', 
			'category', 
			'agent_id', 
			'amount', 
			'date_added'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'photo', 
			'category', 
			'agent_id', 
			'amount', 
			'date_added'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'category', 
			'amount', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'agent_id', 
			'date_added'
		];
	}

	static revenueFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'photo', 
			'category', 
			'agent_id', 
			'amount', 
			'date_added'
		];
	}

	static exportRevenueFields() {
		let sequelize = this.sequelize;
		return [
			'patient_id', 
			'first_name', 
			'last_name', 
			'phone_number', 
			'policy_doc', 
			'hospital_invoice', 
			'status', 
			'photo', 
			'category', 
			'agent_id', 
			'amount', 
			'date_added'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("policy_doc LIKE :search"), 
			sequelize.literal("hospital_invoice LIKE :search"),
		];
	}

	
}
module.exports = Patient;
