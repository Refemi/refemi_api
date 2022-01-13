const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });


const creatAdmin = async (req,res) => {
  try{
    res.status().json()
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: error
    });
  }   
}
       
const getAdmin = async (req,res) => {  
  try {
      res.status().json()
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: error
    });
  } 
}
       
const modifyAdmin = async(req,res) => {
  try {
    res.status().json()
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });
  }
}
       
const deleteAdmin = async (req,res) => { 
  try{
    res.status().json()
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });
  }
}

const getThemes = async (_, response) => {
  let themes;

  try {
    const themesQuery = `
      SELECT
        id, theme_name AS "name", theme_label AS label, theme_active AS active
      FROM themes
    `;
    const themesResult = await Postgres.query(themesQuery);

    if (themesResult.rows.length === 0) {
      return response.status(404).json({
        message: "There are no registered themes",
      });
    }

    await response.status(200).json({
      themes: themesResult.rows,
    });
  } catch (error) {
    response.status(500).json({
      error: error
    });
  }
};


module.exports = {
  creatAdmin,
  deleteAdmin,
  getAdmin,
  getThemes,
  modifyAdmin
};  
