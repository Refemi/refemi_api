const express = require("express");
const router = express.Router();
const {checkUser,logout,modifyUser} =require("../controllers/userControllers");
const {protect}=require("../middlewares/protect");
const{checkRights}=require("../middlewares/checkRight")



router.post("/",checkUser);
router.delete("/logout",logout);
router.put("/", modifyUser)



module.exports = router;
