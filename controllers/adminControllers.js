const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });


const  creatAdmin=async(req,res)=>{
    
    try{
      
        res.status().json()
    }
    catch(err){
        res.status(500).json(err)
    }
    
}
       
const  getAdmin=async(req,res)=>{
    
    try{
      
        res.status().json()
    }
    catch(err){
        res.status(500).json(err)
    }
    
}
       
const  modifyAdmin=async(req,res)=>{
    
    try{
      
        res.status().json()
    }
    catch(err){
        res.status(500).json(err)
    }
    
}
       
const  deleteAdmin=async(req,res)=>{
    
    try{
      
        res.status().json()
    }
    catch(err){
        res.status(500).json(err)
    }
    
}
       

       
  
 module.exports = {creatAdmin,modifyAdmin,getAdmin,deleteAdmin};  
