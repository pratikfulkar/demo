
const BaseModel = require("./basemodel");
class Category extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				category_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				title: {name: 'title', type:Sequelize.STRING},
				description: {name: 'description', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "category",
				modelName: "category",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'category_id', 
			'title', 
			'description'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'category_id', 
			'title', 
			'description'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'category_id', 
			'title', 
			'description'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'category_id', 
			'title', 
			'description'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'category_id', 
			'title', 
			'description'
		];
	}

	
	
}
module.exports = Category;
