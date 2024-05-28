const express = require("express");
const { createGroupCategory, getGroupCategory, updateGroupCategory } = require("../controller/adminControllers");
const { isAuthorized, isAdmin } = require("../middlewares/auth");
const router = express.Router()

// Create Group Category
router.get("/group-category", getGroupCategory)
router.post("/group-category", createGroupCategory)
router.put("/update-group-category/:id", updateGroupCategory)
// Create Category
// Create Sub Category
// Create Brands
// Create Product

module.exports = router