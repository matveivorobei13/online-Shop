const pool = require("../config/db")

async function getProducts(search, category, sort, page, limit){
    let query = "SELECT * FROM products"
    const values = []
    const conditions = []
    if(search){
        conditions.push(`title ILIKE $${values.length + 1}`)
        values.push(`%${search}%`)
    }
    if(category){
        conditions.push(`category_id = $${values.length + 1}`)
        values.push(category)
    }
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    switch(sort){
        case "price_asc":
            query += " ORDER BY price ASC"
            break
        case "price_desc":
            query += " ORDER BY price DESC"
            break
        case "date_asc":
            query += " ORDER BY date ASC"
            break
        case "date_desc":
            query += " ORDER BY date DESK"
            break
    }
    query += `  LIMIT $${values.length + 1}`
    values.push(limit)
    query += `  OFFSET $${values.length + 1}`
    const offset = (page - 1) * limit;
    values.push(offset)
    
    const products = await pool.query(query, values)
    return products.rows
}

async function createProduct(product, url){
    await pool.query(`INSERT INTO products(category_id, title, description, price, stock_quantity, image_url)
        VALUES($1, $2, $3, $4, $5, $6)`, [product.category_id, product.title, product.description, product.price, 5, url])
}

async function getProductById(id) {
    const product = await pool.query(`SELECT * FROM products WHERE id = $1`, [id])
    return product.rows[0]
}

async function deleteProduct(id){
    await pool.query(`DELETE FROM products WHERE id = $1`, [id])
}

async function editProduct(new_product, url, id){
    await pool.query(`UPDATE products
        SET category_id = $1,
        title = $2,
        description = $3,
        price = $4,
        image_url = $5
        WHERE id = $6`,
    [new_product.category_id, new_product.title, new_product.description, new_product.price, url, id])
}



module.exports = {
    getProducts,
    createProduct,
    getProductById,
    deleteProduct,
    editProduct
}



