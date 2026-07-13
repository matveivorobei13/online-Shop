const { z } = require("zod")

const editOrderStatus = z.object({
    status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
])
})

module.exports = {
    editOrderStatus
}