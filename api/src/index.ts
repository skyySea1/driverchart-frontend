import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

// Plugins
import cors from "./plugins/cors";
import jwt from "./plugins/jwt";
import swagger from "./plugins/open-api/swagger";

// Routes
import driverRoutes from "./routes/drivers/drivers";
import vehicleRoutes from "./routes/vehicles/vehicles";
import documentRoutes from "./routes/documents";
import userRoutes from "./routes/users/users";
import expirationRoutes from "./routes/expiration";

const fastify = Fastify({
  logger: true,
});

// Set validator and serializer compilers for Zod
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Register Plugins
await fastify.register(cors);
await fastify.register(jwt);
await fastify.register(swagger);

// Register Routes
await fastify.register(driverRoutes, { prefix: "/api/drivers" });
await fastify.register(vehicleRoutes, { prefix: "/api/vehicles" });
await fastify.register(documentRoutes, { prefix: "/api/documents" });
await fastify.register(userRoutes, { prefix: "/api/users" });
await fastify.register(expirationRoutes, { prefix: "/api/expiration" });

// Health check
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// runner
try {
  const port = Number(process.env.PORT) || 3000;
  await fastify.listen({ port, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
