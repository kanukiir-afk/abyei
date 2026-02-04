import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../prismaClient";
import { requireAuth } from "../middleware/auth";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});

const upload = multer({ storage });

// upload image/video (Editor/Admin)
router.post("/upload", requireAuth("EDITOR"), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const url = `/uploads/${req.file.filename}`;
    const type = req.file.mimetype.startsWith("image") ? "IMAGE" : "VIDEO";
    const media = await prisma.media.create({ data: { url, type: type as any, caption: req.body.caption } });
    return res.json({ media });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
