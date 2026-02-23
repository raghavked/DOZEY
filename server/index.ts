import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json({ limit: "10mb" }));

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
  }
  next();
}
app.use(securityHeaders);

function phiCacheControl(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith("/api/") && req.path !== "/api/config") {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
}
app.use(phiCacheControl);

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      res.setHeader("Retry-After", String(Math.ceil((record.resetTime - now) / 1000)));
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    record.count++;
    next();
  };
}
app.use("/api/auth/", rateLimit(10, 60 * 1000));
app.use("/api/chat", rateLimit(20, 60 * 1000));
app.use("/api/", rateLimit(100, 60 * 1000));

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore) {
    if (now > value.resetTime) rateLimitStore.delete(key);
  }
}, 60 * 1000);

export function auditLog(req: Request, action?: string) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const reqPath = req.path;
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const userId = (req as any).userId || "unauthenticated";
  const detail = action ? ` | Action: ${action}` : "";
  console.log(`[AUDIT] ${timestamp} | ${method} ${reqPath} | IP: ${ip} | User: ${userId}${detail}`);
}

async function main() {
  const uploadsDir = path.resolve(__dirname, "../uploads");
  const fs = await import("fs");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.get("/api/config", (_req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL?.trim(),
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY?.trim(),
    });
  });

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
