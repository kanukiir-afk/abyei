import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";
import { requireAuth } from "../middleware/auth";

const router = Router();

const createNewsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(10),
  image: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional()
});

// Public: list news with simple pagination and search
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const page = Math.max(1, Number(req.query.page) || 1);
    const perPage = Math.min(50, Number(req.query.perPage) || 10);
    const where: any = { published: true };
    if (q) {
      where.OR = [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }];
    }
    const [items, total] = await Promise.all([
      prisma.news.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }),
      prisma.news.count({ where })
    ]);
    return res.json({ items, total, page, perPage });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Public: get single article
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const item = await prisma.news.findUnique({ where: { slug } });
    if (!item || !item.published) return res.status(404).json({ error: "Not found" });
    return res.json({ item });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Editor/Admin: create news
router.post("/", requireAuth("EDITOR"), async (req, res) => {
  try {
    const data = createNewsSchema.parse(req.body);
    const item = await prisma.news.create({ data: { ...data, authorId: req.body.authorId || (req as any).user?.sub } });
    return res.json({ item });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// Editor/Admin: update
router.put("/:id", requireAuth("EDITOR"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const data = createNewsSchema.partial().parse(req.body);
    const item = await prisma.news.update({ where: { id }, data });
    return res.json({ item });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// Admin: delete
router.delete("/:id", requireAuth("ADMIN"), async (req, res) => {
  try {
    const id = String(req.params.id);
    await prisma.news.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
