const cartRouter = require("express").Router()
const cartController = require("../controllers/cart_controller")
const authMiddleware  = require("../middleware/auth_middleware")



cartRouter.get("/",
    authMiddleware.authMiddleware,
    cartController.getCartItemsController
)

cartRouter.post("/:id",
    authMiddleware.authMiddleware,
    cartController.addItemController
)

cartRouter.delete("/:id",
    authMiddleware.authMiddleware,
    cartController.deleteCartItemController
)

cartRouter.put("/:id",
    authMiddleware.authMiddleware,
    cartController.editItemQuantityController
)

cartRouter.delete("/",
    authMiddleware.authMiddleware,
    cartController.deleteCartController
)


module.exports = cartRouter

