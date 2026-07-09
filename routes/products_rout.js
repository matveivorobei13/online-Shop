const productsRouter = require("express").Router()
const productsController = require("../controllers/products_controller")

const authMiddleware = require("../middleware/auth_middleware")
const fileMiddleware = require("../middleware/file_middleware")
const schemasMiddleware = require("../middleware/schema_middleware")

const productSchemas = require("../schemas/product_schemas")

productsRouter.get("/", productsController.getProductsController)

productsRouter.post("/",
    authMiddleware.authMiddleware,
    authMiddleware.roleMiddleware,
    fileMiddleware.upload.single("image"),
    fileMiddleware.fileMiddleware,
    schemasMiddleware.schemasValidate(productSchemas.createProductSchema),
    productsController.createProductController)

productsRouter.get("/:id", productsController.getProductController)

productsRouter.delete("/:id",
    authMiddleware.authMiddleware,
    authMiddleware.roleMiddleware,
    productsController.deleteProductContoller
)

productsRouter.put("/:id",
    authMiddleware.authMiddleware,
    authMiddleware.roleMiddleware,
    fileMiddleware.upload.single("image"),
    fileMiddleware.fileMiddleware,
    schemasMiddleware.schemasValidate(productSchemas.createProductSchema),
    productsController.editProductContoller
)
module.exports = productsRouter