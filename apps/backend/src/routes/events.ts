import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";
import { requireAuth } from "../middleware/auth";

const router = Router();

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().optional(),
  address: z.string().optional(),
  startAt: z.string(),
  endAt: z.string().optional(),
  published: z.boolean().optional()
});

// list upcoming and past
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const upcoming = await prisma.event.findMany({ where: { published: true, startAt: { gte: now } }, orderBy: { startAt: "asc" } });
    const past = await prisma.event.findMany({ where: { published: true, startAt: { lt: now } }, orderBy: { startAt: "desc" } });
    return res.json({ upcoming, past });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// detail
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ev = await prisma.event.findUnique({ where: { id } });
    if (!ev || !ev.published) return res.status(404).json({ error: "Not found" });
    return res.json({ ev });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// create
router.post("/", requireAuth("EDITOR"), async (req, res) => {
  try {
    const data = eventSchema.parse(req.body);
    const ev = await prisma.event.create({ data: { ...data, startAt: new Date(data.startAt), endAt: data.endAt ? new Date(data.endAt) : undefined } as any });
    return res.json({ ev });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// update
router.put("/:id", requireAuth("EDITOR"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const data = eventSchema.partial().parse(req.body);
    if (data.startAt) (data as any).startAt = new Date((data as any).startAt);
    if (data.endAt) (data as any).endAt = new Date((data as any).endAt);
    const ev = await prisma.event.update({ where: { id }, data: data as any });
    return res.json({ ev });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// delete
router.delete("/:id", requireAuth("ADMIN"), async (req, res) => {
  try {
    const id = String(req.params.id);
    await prisma.event.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
