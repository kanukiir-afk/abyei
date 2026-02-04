import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import membersRoutes from "./routes/members";
import mediaRoutes from "./routes/media";

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
import newsRoutes from "./routes/news";
import eventsRoutes from "./routes/events";
import adminRoutes from "./routes/admin";
import contactRoutes from "./routes/contact";

app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/admin", adminRoutes);
// serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/media", mediaRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

export default app;
