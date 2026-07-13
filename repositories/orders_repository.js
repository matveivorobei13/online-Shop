
const pool = require("../config/db")

async function getOrders(user_id){
    const oreders = await pool.query(`SELECT * FROM orders WHERE user_id = $1`, [user_id])
    return oreders.rows
}

async function getOrder(id){
    const order = await pool.query(`SELECT o.id,
        o.total_price,
        o.status,
        o.created_at,
        o.user_id,
        p.id AS product_id,
        p.title,
        oi.quantity,
        oi.price_at_purchase
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE o.id = $1
        ORDER BY oi.id DESC`, [id])
    return order.rows
}

async function getOrderByUserId(order_id){
    const order = await pool.query(`SELECT * FROM orders WHERE id = $1`, [order_id])
    return order.rows[0]
}

async function editOrderStatus(order_id, new_status){
    await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [new_status, order_id])
}

async function getUserCart(client, user_id){
    const cart = await client.query(`SELECT * FROM carts WHERE user_id = $1`, [user_id])
    return cart.rows[0]
}
async function getUserCartItems(client, cart_id){
    const items = await client.query(`SELECT p.id AS product_id, p.title, ci.quantity, p.stock_quantity, p.price
        FROM carts c
        JOIN cart_items ci ON c.id = ci.cart_id
        JOIN products p ON p.id = ci.product_id
        WHERE c.id = $1`, [cart_id])
    return items.rows
}

async function createOrder(client, user_id, total_price){
    const order = await client.query(`INSERT INTO orders(user_id, total_price)
        VALUES($1, $2) RETURNING *`, [user_id, total_price])

    return order.rows[0]
}

async function createOrderItems(client, orderId, items) {
    let query = `
        INSERT INTO order_items
        (order_id, product_id, quantity, price_at_purchase)
        VALUES
    `;

    const placeholders = [];
    const values = [];
    let index = 1;

    for (const item of items) {
        placeholders.push(
            `($${index}, $${index + 1}, $${index + 2}, $${index + 3})`
        );

        values.push(
            orderId,
            item.product_id,
            item.quantity,
            item.price
        );

        index += 4;
    }

    query += placeholders.join(", ");

    await client.query(query, values);
}

async function decreaseStock(client, productId, quantity) {
    await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE id = $2`,
        [quantity, productId]
    );
}

async function clearCart(client, cart_id){
    await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart_id])
}
module.exports = {
    getOrders,
    getOrder,
    getOrderByUserId,
    editOrderStatus,
    getUserCart,
    getUserCartItems,
    createOrder,
    createOrderItems,
    decreaseStock,
    clearCart
}