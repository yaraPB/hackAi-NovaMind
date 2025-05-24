import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    TELEGRAM_API_TOKEN: z.string(),

    AGENT_URL: z.string().url(),
    AGENT_TOKEN: z.string(),

    BACKEND_URL: z.string().url(),
    BACKEND_TOKEN: z.string(),
});

const env = envSchema.safeParse(process.env).data!;

export default env;
