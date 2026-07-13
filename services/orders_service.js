const ordersRepository = require("../repositories/orders_repository")
const transitions = require("../utils/order_statuses")

const pool = require("../config/db")

async function getOrdersService(user_id){
    const orders = await ordersRepository.getOrders(user_id)
    return orders
}

async function getOrderService(id, user_id){
    const order = await ordersRepository.getOrder(id)
    console.log(order)
    console.log(user_id)
    if(!order) throw new Error("ORDER_NOT_FOUND")
    
    if(order[0].user_id !== user_id) throw new Error ("FORBIDDEN")
    
    const full_order = await ordersRepository.getOrder(id)

    return {
        id: full_order[0].id,
        total_price: full_order[0].total_price,
        status: full_order[0].status,
        created_ad: full_order[0].created_at,
        order_items: full_order.map(row => ({
            product_id: row.product_id,
            title: row.title,
            quantity: row.quantity,
            price_at_purchase: row.price_at_purchase
        }))
    }
}

async function editOrderStatusService(newStatus, order_id, user_id){
    const order = await ordersRepository.getOrderByUserId(order_id)

    if(!order) throw new Error("ORDER_NOT_FOUND")
    if(order.user_id != user_id) throw new Error ("FORBIDDEN")
    
    if(!transitions[order.status].includes(newStatus)) throw new Error("CANNOT_CHANGE_ORDER_STATUS")
    
    await ordersRepository.editOrderStatus(order_id, newStatus)

}

async function CreateOrderService(user_id){
    const client = await pool.connect()

    try{
        await client.query("BEGIN")

        const cart = await ordersRepository.getUserCart(client, user_id)

        const items = await ordersRepository.getUserCartItems(client, cart.id)
        if(items.length === 0) throw new Error("CART_IS_EMPTY")
        
        for(const item of items){
            if(item.quantity > item.stock_quantity) throw new Error("NOT_ENOUGH_STOCK")
        }
        const totalPrice = items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
        const order = await ordersRepository.createOrder(client, user_id, totalPrice)

        await ordersRepository.createOrderItems(client, order.id, items)

        for(const item of items){
            await ordersRepository.decreaseStock(client, item.product_id, item.quantity)
        }

        await ordersRepository.clearCart(client, cart.id)

        await client.query("COMMIT")
    }
    catch(e){
        await client.query("ROLLBACK")
        throw e
    }
    finally {
        client.release()
    }

    
}

module.exports = {
    getOrdersService,
    getOrderService,
    editOrderStatusService,
    CreateOrderService
    
}