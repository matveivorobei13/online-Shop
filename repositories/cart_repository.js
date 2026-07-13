
const pool = require("../config/db")

async function getCartItems(user_id){
    const cartItems = await pool.query(`SELECT ci.id,
         p.id AS product_id,
         p.title,
         p.price,
         ci.quantity,
         p.image_url,
         p.price * ci.quantity AS subtotal FROM carts c
         JOIN cart_items ci ON ci.cart_id = c.id
         JOIN products p ON p.id = ci.product_id
         WHERE c.user_id = $1
         ORDER BY ci.id DESC`, [user_id])
    return cartItems.rows
}

async function addItem(product_id, cart_id){
    await pool.query(`INSERT INTO cart_items(product_id, cart_id, quantity)
        VALUES($1, $2, 1)`, [product_id, cart_id])
    

}

async function getCartItemByProductId(cart_id, product_id){
    const item = await pool.query(`SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`, [cart_id, product_id])
    return item.rows[0]
}

async function getCart(user_id){
    const cart = await pool.query(`SELECT * FROM carts WHERE user_id = $1`, [user_id])
    return cart.rows[0]
}

async function deleteCartItem(id){
    await pool.query(`DELETE FROM cart_items WHERE id = $1`, [id])
}

async function getItemById(id){
    const item = await pool.query(`SELECT * FROM cart_items WHERE id = $1`, [id])
    return item.rows[0]
}

async function editItemQuantity(quantity, itemId){
    await pool.query(`UPDATE cart_items SET quantity = $1
        WHERE id = $2`, [quantity, itemId])
}

async function deleteCart(cart_id){
    
    await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart_id])
}

module.exports = {
    getCartItems,
    addItem,
    getCartItemByProductId,
    getCart,
    deleteCartItem,
    getItemById,
    editItemQuantity,
    deleteCart
}
