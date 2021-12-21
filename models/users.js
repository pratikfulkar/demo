
const BaseModel = require("./basemodel");
class Users extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				user_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				first_name: {name: 'first_name', type:Sequelize.STRING},
				last_name: {name: 'last_name', type:Sequelize.STRING},
				telephone: {name: 'telephone', type:Sequelize.STRING},
				email: {name: 'email', type:Sequelize.STRING},
				irda_code: {name: 'irda_code', type:Sequelize.STRING},
				photo: {name: 'photo', type:Sequelize.STRING},
				otp_code: {name: 'otp_code', type:Sequelize.STRING},
				password: {name: 'password', type:Sequelize.STRING},
				user_role_id: {name: 'user_role_id', type:Sequelize.INTEGER}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "users",
				modelName: "users",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'email', 
			'irda_code', 
			'photo', 
			'otp_code', 
			'user_role_id'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'email', 
			'irda_code', 
			'photo', 
			'otp_code', 
			'user_role_id'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'email', 
			'irda_code', 
			'otp_code', 
			'user_role_id'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'email', 
			'irda_code', 
			'otp_code', 
			'user_role_id'
		];
	}

	static accounteditFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'photo', 
			'user_role_id'
		];
	}

	static accountviewFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'email', 
			'irda_code', 
			'user_role_id'
		];
	}

	static exportAccountviewFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'email', 
			'irda_code', 
			'user_role_id'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'user_id', 
			'first_name', 
			'last_name', 
			'telephone', 
			'irda_code', 
			'photo', 
			'otp_code', 
			'user_role_id'
		];
	}

	
	
}
module.exports = Users;
