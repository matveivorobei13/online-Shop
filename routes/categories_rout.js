const categoriesRouter = require("express").Router()
const categoriesController = require("../controllers/categories_controller")

const authMiddleware = require("../middleware/auth_middleware")

categoriesRouter.get("/get_categories",
    categoriesController.getCategoriesController)


categoriesRouter.post("/create_category",
    authMiddleware.authMiddleware,
    authMiddleware.roleMiddleware,
    categoriesController.createCategoryController)
module.exports = categoriesRouter

