require('dotenv').config()
const express = require("express")
const cookieParser = require('cookie-parser');
const cors = require("cors")
const authRoutes = require('./routes/auth_rout')
const categoriesRouter = require("./routes/categories_rout")
const productsRouter = require("./routes/products_rout")
const cartRouter = require("./routes/cart_rout")
const ordersRouter = require("./routes/orders_rout")

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/categories", categoriesRouter)
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", ordersRouter)


app.listen(process.env.PORT, () => console.log("Server is running on port 3000"));
