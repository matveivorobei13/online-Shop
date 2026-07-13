const categoriesService = require("../services/categories_service")
const { z } = require("zod")

async function getCategoriesController(req, res){
    try{
        const categories = await categoriesService.getCategoriesService()

        return res.json({status: "ok", categories: categories})
    }
    catch(e){
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
    
}

async function createCategoryController(req, res) {
    try{
        const title = req.body.title
        const schema = z.string().trim().toLowerCase()
        .min(2, "Category name must contain at least 2 characters")
        .max(50, "Category name must not exceed 50 characters")
        const result = schema.safeParse(title)
        if(!result.success){
            const firstErrorMessage = result.error.issues[0].message
            return res.status(409).json({status:"error", message: firstErrorMessage})
        }

        await categoriesService.createCategorySecvice(title)
        return res.json({status: "ok", message: "category created"})
    }
    catch(e){
        if(e.message === "CATEGORY_ALREADY_EXIST") return res.status(409).json({ status: "error", message: "This category already exists" });
        console.log(e.message)
        return res.status(500).json({ status: "error", message: "Internal server error" });

    }
}

module.exports = {
    getCategoriesController,
    createCategoryController
}