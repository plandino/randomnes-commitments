import * as path from 'path';
import * as dotenv from 'dotenv';
import z from 'zod';

// Load the .env file from monorepo root directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Define schema for environment variables
const configSchema = z.object({
    PRC_URL: z.string().url(),
    PRIVATE_KEY: z.string(),
  });
  
// Parse and validate environment variables
const config = configSchema.safeParse(process.env);

if (!config.success) {
    console.error("Invalid environment variables:", config.error.format());
    process.exit(1); // Exit the process with failure
}

// Export the validated and parsed environment variables
export default config;
