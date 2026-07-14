const cartService = require("../services/cart_service")

async function getCartItemsController(req, res){
    try{
        const cartItems = await cartService.getCartItemsService(req.user.id)
        return res.json({status:"ok", items: cartItems})
    }
    catch(e){
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function addItemController(req, res){
    try{
        const product_id = parseInt(req.params.id, 10)
        if(isNaN(product_id) || product_id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})

        await cartService.addItemService(req.user.id, product_id)
        return res.json({status: "ok", message: "product added into the cart"})
    }
    catch(e){
        if(e.message === "PRODUCT_ALREADY_IN_CART") return res.status(409).json({ status: "error", message: "product already in cart" });
        console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function deleteCartItemController(req, res){
    try{
        const id = parseInt(req.params.id, 10)
        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})
        
        await cartService.deleteCartItemService(req.user.id, id)

        return res.json({status: "ok", message: "item deleted from cart"})
        

    }
    catch(e){
        if(e.message === "ITEM_NOT_FOUND") return res.status(404).json({ status: "error", message: "item not found" });
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function editItemQuantityController(req, res){
    try{
        const quantity = parseInt(req.body.quantity, 10)
        const id = parseInt(req.params.id, 10)

        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})
        if(isNaN(quantity) || quantity <= 0) return res.status(400).json({status: "error", message: "quantity must be an integer and greater than 0"})
        
        await cartService.editItemQuantityService(quantity, id, req.user.id)
        return res.json({status: "ok", message: "quantity edited"})
    }
    catch(e){
        if(e.message === "ITEM_NOT_FOUND") return res.status(404).json({status: "error", message: "item not found"})
        return res.status(500).json({ status: "error", message: "Internal server error" });

    }

}

async function deleteCartController(req, res){
    try{
        await cartService.deleteCartService(req.user.id)
        return res.json({status: "ok", message: "cart cleaned"})
    }
    catch(e){
        return res.status(500).json({ status: "error", message: "Internal server error" });

    }
}

module.exports = {
    getCartItemsController,
    addItemController,
    deleteCartItemController,
    editItemQuantityController,
    deleteCartController
}