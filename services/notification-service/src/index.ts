import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { startConsumer } from "./consumer";
import { addClient, removeClient } from "./websocket";

const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Notification Service API",
          version: "1.0.0",
          description: "API untuk manajemen notifikasi order",
        },
      },
    }),
  )
  .get("/health", () => ({ status: "ok", service: "notification-service" }), {
    detail: {
      summary: "Health check",
      tags: ["Health"],
    },
  })
  .ws("/ws", {
    open(ws) {
      addClient(ws);
    },
    close(ws) {
      removeClient(ws);
    },
    message(_ws, _message) {
      // tidak perlu handle pesan dari client
    },
  })
  .listen(3003);

startConsumer().catch(console.error);

console.log(`Notification Service running on port ${app.server?.port}`);
