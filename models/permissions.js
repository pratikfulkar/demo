
const BaseModel = require("./basemodel");
class Permissions extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				permission_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				role_id: {name: 'role_id', type:Sequelize.INTEGER},
				permission: {name: 'permission', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "permissions",
				modelName: "permissions",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'permission_id', 
			'role_id', 
			'permission'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'permission_id', 
			'role_id', 
			'permission'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'permission_id', 
			'role_id', 
			'permission'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'permission_id', 
			'role_id', 
			'permission'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'permission_id', 
			'role_id', 
			'permission'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("permission LIKE :search"),
		];
	}

	
}
module.exports = Permissions;
