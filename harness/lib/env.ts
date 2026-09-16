import { config } from "dotenv";
// Next.js convention: secrets live in .env.local; plain .env is also honoured.
config({ path: [".env.local", ".env"] });
