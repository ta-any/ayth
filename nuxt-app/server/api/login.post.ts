import db from './users.json'
import posts from './product.json'

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

    return {
        user: {
            name: user.name,
            username: user.surname,
            credentials: user.credentials,
            active: user.active,
            product: posts
        }
    }
})