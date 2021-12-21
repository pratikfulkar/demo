
const BaseModel = require("./basemodel");
class Categories extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				category: { type: Sequelize.STRING, primaryKey: true  }
			}, 
			{ 
				sequelize,
				schema: "public", 
				tableName: "categories",
				modelName: "categories",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'category'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'category'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'category'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'category'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'category'
		];
	}

	
	
}
module.exports = Categories;
