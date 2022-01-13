const express = require("express");
const router = express.Router();

 const{creatAdmin,modifyAdmin,getAdmin,deleteAdmin}=require("../controllers/adminControllers");

 router.post("/",creatAdmin);
 router.get("/",getAdmin)
 router.put("/", modifyAdmin);
 router.delete("/",deleteAdmin);



module.exports = router;