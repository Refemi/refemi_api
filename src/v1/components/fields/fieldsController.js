const { Pool } = require("pg");
const Postgres = new Pool();

class Fields {
  /**
   * Get all fields
   */
  async getAllFields(_, response, next) {
    try {
      const fieldsRequest = `  
        SELECT field_name as name, id from fields;
      `;

      const fieldsResult = await Postgres.query(fieldsRequest);

      if (!fieldsResult) {
        throw new ErrorFieldsNotFound();
      }

      const fields = fieldsResult.rows;

      response.status(200).json({ fields });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Fields();
