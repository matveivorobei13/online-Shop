const ordersRrouter = require("express").Router()
const ordersController = require("../controllers/orders_controller")

const authMiddleware = require("../middleware/auth_middleware")
const SchemaMiddleware = require("../middleware/schema_middleware")
const { editOrderStatus } = require("../repositories/orders_repository")
const orderSchemas = require("../schemas/order_schemas")

ordersRrouter.get("/",
    authMiddleware.authMiddleware,
    ordersController.getOrdersController
)

ordersRrouter.get("/:id",
    authMiddleware.authMiddleware,
    ordersController.getOrderController
)

ordersRrouter.patch("/:id",
    authMiddleware.authMiddleware,
    authMiddleware.roleMiddleware,
    SchemaMiddleware.schemasValidate(orderSchemas.editOrderStatus),
    ordersController.editOrderStatusController

)

ordersRrouter.post("/",
    authMiddleware.authMiddleware,
    ordersController.CreateOrderController
)

module.exports = ordersRrouter