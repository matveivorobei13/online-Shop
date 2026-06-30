const { z } = require("zod")

const register = z.object({
    name: z.string()
    .min(3, {message: "имя должно быть не меньше 3 символов"})
    .max(50, {message: "имя должно быть не больше 50 символов"}),
    email: z.string()
    .email({message: "некоректный формат email"})
    .trim()
    .toLowerCase(),
    password: z.string()
    .min(4, {message: "пароль должен быть не меньше 4 символов"})
    .max(100, {message: "пароль должен быть не больше 100 символов"})
    .regex(/\d/, { message: 'Пароль должен содержать хотя бы одну цифру.' }),
    
})

const login = z.object({
    name: z.string().min(1, {message: "имя обязателеное для заполнения"}),
    password: z.string().min(1, {message: "пароль обязателеный для заполнения"})
})

module.exports = {
    login, register
}