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


module.exports = {
  creatAdmin,
  modifyAdmin,
  getAdmin,
  deleteAdmin
};  
