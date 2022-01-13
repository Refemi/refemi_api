const express = require("express");
const router = express.Router();

 const{
    creatAdmin,
    modifyAdmin,
    getAdmin,
    getThemes,
    deleteAdmin
} = require("../controllers/adminControllers");

 router.get("/themes", getThemes);
 router.post("/",creatAdmin);
 router.get("/",getAdmin)
 router.put("/", modifyAdmin);
 router.delete("/",deleteAdmin);



module.exports = router;