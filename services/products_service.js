const productsRepository = require("../repositories/products_repository")
const categoriesRepository = require("../repositories/categories_repository")
async function getProductsService(query){
    let page = query.page || 1
    let limit = query.limit || 10

    if (page < 1) page = 1;
    if (limit < 1) limit = 20;
    if(limit > 100) limit = 100

    const products = await productsRepository.getProducts(query.search, 
        query.category_id, 
        query.sort, page, 
        limit)
    return products
}

async function createProductService(product, url){
    const category = await categoriesRepository.getCategoryById(product.category_id)
    if(category.length !== 1) throw new Error("CATEGORY_NOT_FOUND")
    
    await productsRepository.createProduct(product, url)
}

async function getProductService(id) {
    const product = await productsRepository.getProductById(id)
    return product
}

async function deleteProductService(product_id){
    const product = await productsRepository.getProductById(product_id)
    if(!product) throw new Error("PRODUCT_NOT_FOUND")
    await productsRepository.deleteProduct(product_id)
}
async function editProductService(product_id, new_product, url){
    const product = await productsRepository.getProductById(product_id)
    if(!product) throw new Error("PRODUCT_NOT_FOUND")
    await productsRepository.editProduct(new_product, url, product_id)
}
module.exports = {
    getProductsService,
    createProductService,
    getProductService,
    deleteProductService,
    editProductService
}