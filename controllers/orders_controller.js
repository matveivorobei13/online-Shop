const ordersService = require("../services/orders_service")

async function getOrdersController(req, res){
    try{
        const orders = await ordersService.getOrdersService(req.user.id)

        return res.json({status: "ok", orders: orders})
    }
    catch(e){
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function getOrderController(req, res){
    try{
        const id = parseInt(req.params.id, 10)
        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})

        const order = await ordersService.getOrderService(id, req.user.id)
         return res.json({status: "ok", order: order})
    }
    catch(e){
        if(e.message === "ORDER_NOT_FOUND") return res.status(404).json({status:"error", message: "order not found"})
        if(e.message === "FORBIDDEN") return res.status(401).json({status:"error", message: "you can get only your orders"})
            console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
        
    }
}

async function editOrderStatusController(req, res){
    try{
        const id = parseInt(req.params.id, 10)
        const status = req.body.status
        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})
        await ordersService.editOrderStatusService(status, id, req.user.id)

        return res.json({status: "ok", message: "status changed"})
    }
    catch(e){
        if(e.message === "ORDER_NOT_FOUND") return res.status(404).json({status:"error", message: "order not found"})
        if(e.message === "FORBIDDEN") return res.status(401).json({status:"error", message: "you can get only your orders"})
        if(e.message === "CANNOT_CHANGE_ORDER_STATUS") return res.status(400).json({status: "error", message:"cannot change order status"})
        console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function CreateOrderController(req, res){
    try{
        await ordersService.CreateOrderService(req.user.id)

        return res.json({status: "ok", message: "order created"})
    }
    catch(e){
        if(e.message === "CART_IS_EMPTY") return res.status(409).json({status:"error", message: "cart is empty"})
        if(e.message === "NOT_ENOUGH_STOCK") return res.status(409).json({status:"error", message: "not enough stock"})
        console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

module.exports = {
    getOrdersController,
    getOrderController,
    editOrderStatusController,
    CreateOrderController
}