import express from "express";
import path from "path";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());

async function main() {
  await setupAuth(app);
  registerAuthRoutes(app);
  registerRoutes(app);

  if (process.env.NODE_ENV === "production") {
    const clientPath = path.resolve(__dirname, "../client/dist");
    app.use(express.static(clientPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientPath, "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      root: path.resolve(__dirname, "../client"),
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const port = 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch(console.error);
