const pool = require("../config/db")

async function getCategories(){
    const categories = await pool.query(`SELECT * FROM categories`)
    return categories.rows
}
async function getCategoriesByTitle(title){
    const categories = await pool.query(`SELECT * FROM categories WHERE title = $1`, [title])
    return categories.rows[0]
}

async function createCategory(title){
    await pool.query(`INSERT INTO categories (title)
         VALUES($1)`, [title])
}

module.exports = {
    getCategories,
    getCategoriesByTitle,
    createCategory
}