
const BaseModel = require("./basemodel");
class Roles extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				role_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				role_name: {name: 'role_name', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "roles",
				modelName: "roles",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'role_id', 
			'role_name'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'role_id', 
			'role_name'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'role_id', 
			'role_name'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'role_id', 
			'role_name'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'role_id', 
			'role_name'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("role_name LIKE :search"),
		];
	}

	
}
module.exports = Roles;
