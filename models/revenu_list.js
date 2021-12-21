
const BaseModel = require("./basemodel");
class Revenu_List extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				revenue_id: { type: Sequelize.INTEGER, primaryKey: true  },
				amount: {name: 'amount', type:Sequelize.DECIMAL},
				agent_id: {name: 'agent_id', type:Sequelize.INTEGER},
				date_paid: {name: 'date_paid', type:Sequelize.STRING},
				patient_id: {name: 'patient_id', type:Sequelize.INTEGER},
				patient_names: {name: 'patient_names', type:Sequelize.STRING},
				status: {name: 'status', type:Sequelize.STRING},
				photo: {name: 'photo', type:Sequelize.STRING},
				category: {name: 'category', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "revenu_list",
				modelName: "revenu_list",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'date_paid', 
			'patient_id', 
			'patient_names', 
			'status', 
			'photo', 
			'category'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'date_paid', 
			'patient_id', 
			'patient_names', 
			'status', 
			'photo', 
			'category'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'date_paid', 
			'patient_id', 
			'patient_names', 
			'status', 
			'photo', 
			'category'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'revenue_id', 
			'amount', 
			'agent_id', 
			'date_paid', 
			'patient_id', 
			'patient_names', 
			'status', 
			'photo', 
			'category'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("patient_names LIKE :search"),
		];
	}

	
}
module.exports = Revenu_List;
