import { z } from "zod"

export const envSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)