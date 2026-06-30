const authRouter = require("express").Router()

const authControllers = require("../controllers/auth_controller")

const authSchemas = require("../schemas/auth_schemas")

const authMiddleware = require("../middleware/auth_middleware")
const fileMiddleware = require("../middleware/file_middleware")
const schemasMiddleware = require("../middleware/schema_middleware")



authRouter.post("/register",
    fileMiddleware.upload.single("avatar"),
    fileMiddleware.fileMiddleware,
    schemasMiddleware.schemasValidate(authSchemas.register),
    authControllers.registerController
)

authRouter.post("/login",
    schemasMiddleware.schemasValidate(authSchemas.login),
    authControllers.loginController
)

authRouter.get("/me",
    authMiddleware.authMiddleware,
    authControllers.meController
)

authRouter.get("/refresh",
    authControllers.refreshController
)

module.exports = authRouter

