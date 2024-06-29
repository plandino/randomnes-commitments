import * as path from 'path';
import * as dotenv from 'dotenv';
import z from 'zod';

// Load the .env file from monorepo root directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Define schema for environment variables
const configSchema = z.object({
    RPC_URL: z.string().url(),
    PRIVATE_KEY: z.string(),
});
  
// Parse and validate environment variables
const secrets = configSchema.safeParse(process.env);

if (!secrets.success) {
    console.error("Invalid environment variables:", secrets.error.format());
    process.exit(1); // Exit the process with failure
}

// Export the validated and parsed environment variables
export default secrets.data;
