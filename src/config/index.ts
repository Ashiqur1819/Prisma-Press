import dotenv from "dotenv"
import path from "path"
dotenv.config({
    path: path.join(process.cwd(), ".env")
})

const config = {
    database_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expiredIn: process.env.JWT_ACCESS_EXPIRED_IN,
    jwt_refresh_expiredIn: process.env.JWT_REFRESH_EXPIRED_IN,
    stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
}

export default config;