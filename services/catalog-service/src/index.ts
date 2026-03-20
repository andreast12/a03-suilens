import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";
import { lenses } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Catalog Service API",
          version: "1.0.0",
          description: "API untuk manajemen katalog lensa",
        },
      },
    }),
  )
  .get(
    "/api/lenses",
    async () => {
      return db.select().from(lenses);
    },
    {
      detail: {
        summary: "Get all lenses",
        description: "Mengambil seluruh data lensa yang tersedia",
        tags: ["Lenses"],
      },
    },
  )
  .get(
    "/api/lenses/:id",
    async ({ params }) => {
      const results = await db
        .select()
        .from(lenses)
        .where(eq(lenses.id, params.id));
      if (!results[0]) {
        return new Response(JSON.stringify({ error: "Lens not found" }), {
          status: 404,
        });
      }
      return results[0];
    },
    {
      detail: {
        summary: "Get lens by ID",
        description: "Mengambil data satu lensa berdasarkan ID",
        tags: ["Lenses"],
      },
    },
  )
  .get("/health", () => ({ status: "ok", service: "catalog-service" }), {
    detail: {
      summary: "Health check",
      tags: ["Health"],
    },
  })
  .listen(3001);

console.log(`Catalog Service running on port ${app.server?.port}`);
