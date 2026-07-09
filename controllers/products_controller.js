
const productsService = require("../services/products_service")

async function getProductsController(req, res){
    try{
        const products = await productsService.getProductsService(req.query)

        return res.json({status: "ok", products: products})
    }
    catch(e){
        console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function createProductController(req, res){
    try{
        const imgPath = req.file ? req.file.filename : null;
        await productsService.createProductService(req.body, imgPath)
        return res.json({status: "ok", message: "product created"})
    }
    catch(e){
        if(e.message === "CATEGORY_NOT_FOUND") return res.status(404).json({ status: "error", message: "category not found" });
        
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

async function getProductController(req, res){
    try{
        const id = parseInt(req.params.id, 10)

        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})
    
        const product = await productsService.getProductService(id)
        return res.json({status: "ok", product: product})
    }
    catch(e){
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
    

}
async function deleteProductContoller(req, res){
    try{
        const id = parseInt(req.params.id, 10)
        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})

        await productsService.deleteProductService(id)
        return res.json({status: "ok", message: "product deleted"})
    }
    catch(e){
        if(e.message === "PRODUCT_NOT_FOUND") return res.status(404).json({ status: "error", message: "product not found" });
        console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}
async function editProductContoller(req, res){
    try{
        const id = parseInt(req.params.id, 10)
        if(isNaN(id) || id <= 0) return res.status(400).json({status: "error", message: "ID must be an integer and greater than 0"})

        await productsService.editProductService(id, req.body, req.file.filename)
        return res.json({status: "ok", message: "product edited"})
    }
    catch(e){
        if(e.message === "PRODUCT_NOT_FOUND") return res.status(404).json({ status: "error", message: "product not found" });
        console.error(e)
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

module.exports = {
    getProductsController,
    createProductController,
    getProductController,
    deleteProductContoller,
    editProductContoller
    
}