const cartRepositry = require("../repositories/cart_repository")

async function getCartItemsService(user_id){
    const cartItems = await cartRepositry.getCartItems(user_id)

    return cartItems
}



async function addItemService(user_id, product_id){
    const cart = await cartRepositry.getCart(user_id)

    const cartItem = await cartRepositry.getCartItemByProductId(cart.id, product_id)

    if(cartItem) throw new Error("PRODUCT_ALREADY_IN_CART")
    
    await cartRepositry.addItem(product_id, cart.id)
}

async function deleteCartItemService(user_id, item_id){
    const cart = await cartRepositry.getCart(user_id)

    const cartItem = await cartRepositry.getItemById(item_id)

    if(!cartItem) throw new Error("ITEM_NOT_FOUND")

    await cartRepositry.deleteCartItem(item_id)

}

async function editItemQuantityService(quantity, itemId){
    const item = cartRepositry.getItemById(itemId)
    if(!item) throw new Error("ITEM_NOT_FOUND")
    
    await cartRepositry.editItemQuantity(quantity, itemId)
}

async function deleteCartService(user_id){
    const cart = await cartRepositry.getCart(user_id)
    
    await cartRepositry.deleteCart(cart.id)
}

module.exports = {
    getCartItemsService,
    addItemService,
    deleteCartItemService,
    editItemQuantityService,
    deleteCartService
}