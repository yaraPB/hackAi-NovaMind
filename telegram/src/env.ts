import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    TELEGRAM_API_TOKEN: z.string(),

    GEMINI_API_TOKEN: z.string(),

    HF_TOKEN: z.string(),

    DATABASE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);


export default env;
