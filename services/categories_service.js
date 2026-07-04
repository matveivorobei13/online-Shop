const categoriesRepository = require("../repositories/categories_repository")

async function getCategoriesService() {
    const categories = await categoriesRepository.getCategories

    return categories
}

async function createCategorySecvice(title){
    const findedCategories = await categoriesRepository.getCategoriesByTitle(title)
    if(findedCategories) throw new Error("CATEGORY_ALREADY_EXIST")
    await categoriesRepository.createCategory(title)
    return true
}

module.exports = {
    getCategoriesService,
    createCategorySecvice
}