const Sequelize = require("sequelize");
class BaseModel extends Sequelize.Model{
	static async paginate(query, page, limit){
		query.offset = limit * (page - 1);
		query.limit = limit;
		let result = await this.findAndCountAll(query);
		let total_records = result.count;
		let records = result.rows;
		let record_count = records.length;
		let total_page = Math.ceil(total_records / limit);
		let data = {
			total_records,
			record_count,
			total_page,
			records
		}
		return data;
	}

	static getOrderBy(req){
		let pk = this.primaryKeyAttributes[0];
		let orderby = req.query.orderby || pk;
		if(orderby){
			let ordertype = req.query.ordertype || 'desc';
			let order = Sequelize.literal(`${orderby} ${ordertype}`);
			return [[order]];
		}
		return null;
	}
}
module.exports = BaseModel;