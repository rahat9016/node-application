const express = require("express");
const { createGroupCategory, getGroupCategory, updateGroupCategory, createCategory, getCategory, updateCategory } = require("../controller/adminControllers");
const { isAuthorized, isAdmin } = require("../middlewares/auth");
const router = express.Router()

// Create Group Category
router.get("/group-category", getGroupCategory)
router.post("/group-category", createGroupCategory)
router.patch("/group-category/:id", updateGroupCategory)
// Create Category
router.get("/category", getCategory)
router.post("/category", createCategory)
router.patch("/category/:id", updateCategory)
// Create Sub Category
// Create Brands
// Create Product

module.exports = router