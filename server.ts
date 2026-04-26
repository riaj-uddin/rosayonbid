import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./server/routes/auth.routes";
import elementRoutes from "./server/routes/element.routes";
import aiRoutes from "./server/routes/ai.routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/elements", elementRoutes);
  app.use("/api/ai", aiRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), version: "2.1.0" });
  });

  // Mock persistence for progress (in-memory for now)
  let userProgress = {
    solvedQuizzes: 4,
    learnedElements: ["Hydrogen", "Helium", "Carbon"],
    points: 1250,
    badges: [
      { id: '1', name: 'Pioneer', description: 'Started the journey', icon: 'Rocket', unlockedAt: new Date().toISOString() },
      { id: '2', name: 'Nucleus Master', description: 'Solved 10 quizzes', icon: 'Shield' }
    ],
    quizHistory: [
      { date: '2026-04-20', score: 80 },
      { date: '2026-04-21', score: 90 },
      { date: '2026-04-22', score: 75 },
      { date: '2026-04-23', score: 100 },
      { date: '2026-04-24', score: 95 }
    ]
  };

  app.get("/api/progress", (req, res) => {
    res.json(userProgress);
  });

  app.post("/api/progress", (req, res) => {
    userProgress = { ...userProgress, ...req.body };
    res.json(userProgress);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Atomix Enterprise Backend running on http://localhost:${PORT}`);
  });
}

startServer();
