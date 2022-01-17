// PostGreSQL dependencies
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Routes
const { ErrorCategoriesNotFound } = require("./categoriesErrors");

class Categories {
  /** 
   * @description Get all categories
   * @route GET /categories
   */
  async getAll (_, response, next) {
    try {
      const categoriesQuery =`
        SELECT categories.id, category_name AS name, category_label as label, section_id
          FROM categories
        INNER JOIN sections ON sections.id = section_id
      `;

      const categoriesResult = await Postgres.query(categoriesQuery);
  
      if (categoriesResult.rows.length === 0) {
          throw new ErrorCategoriesNotFound();
      }
  
      response.status(200).json({ categories: categoriesResult.rows });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @description Get all categories by section
   * @route GET /categories/sections/:id
   */
  async getAllBySection (request, response, next) {
    try {
      let categories;
      const { section_id } = request.params;

      const categoriesQuery = `
        SELECT categories.id, category_name AS name, category_label as label
        FROM categories
        WHERE section_id = $1;
      `;
      const categoriesArgument = [section_id];

      const categoriesResult = await Postgres.query(categoriesQuery, categoriesArgument);
      
      if (categoriesResult.rows.length === 0) {
        throw new ErrorCategoriesNotFound(section_id);
      }

      categories = categoriesResult.rows;
    
      response.status(200).json({
        categories: categories,
      })
    } catch (error) {
      next(error);
    }
  };
  /** Get one category by id
   * @route GET /categories/:id
   */
  async getOne (request, response, next) {
    // TODO: Get one category
    response.status(200).json({
      messsage: "Need to do",
    });
  };
  /** Add one category 
   * @route GET /categories
   * @param {object} category
   * @param {string} category.name
   * @param {string} category.label
   * @param {number} category.section_id
   */
  async addOne (request, response, next) {
    // TODO: Create a category
    res.status(201).json({
      message: "Need to do"
    });
  };
  /** Update one category  
   * @route PUT /categories/:id
   * @param {object} category
   * @param {string} category.name
   * @param {string} category.label
   * @param {string} category.section
   * @param {boolean} category.active
   */
  async updateOne (request, response, next) {
    // TODO: Update a category
    res.status(200).json({
      message: "Need to do"
    });
  };
  /** Delete one category
   * @route DELETE /categories/:id
   */
  async deleteOne (request, response, next) {
    // TODO: Delete a category
    res.status(200).json({
      messsage: "Need to do"
    });
  };
}


module.exports = new Categories();
