import db from './users.json'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const user = db.find(
        (u) => u.credentials.username === body.username && u.credentials.passphrase === body.password
    )

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Введены неверные данные авторизации!'
        })
    }

    // In a real app, you would generate a token here
    return {
        user: {
            id: 123,
            username: "iiii",
            email: "email"
        }
    }
})