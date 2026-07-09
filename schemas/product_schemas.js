const { z } = require("zod")

const createProductSchema = z.object({
    title: z.string()
        .trim()
        .min(2, "Title must contain at least 2 characters")
        .max(100, "Title must not exceed 100 characters"),

    description: z.string()
        .trim()
        .min(10, "Description must contain at least 10 characters")
        .max(2000, "Description must not exceed 2000 characters"),

    category_id: z.coerce.number()
        .int("Category ID must be an integer")
        .positive("Category ID must be greater than 0"),

    price: z.coerce.number()
        .positive("Price must be greater than 0"),
});

module.exports = {createProductSchema}