import dotenv from 'dotenv';
dotenv.config();

export const { 
    APP_PORT, 
    DEBUG_MODE, 
    MONGO_CONNECTION_URL, 
    STRIPE_PRIVATE_KEY, 
    JWT_SECRET, 
    REFRESH_SECRET, 
    APP_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;