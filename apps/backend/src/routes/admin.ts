import { Router } from "express";
import { prisma } from "../prismaClient";
import { requireAuth } from "../middleware/auth";

const router = Router();

// list users
router.get("/users", requireAuth("ADMIN"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// update role
router.post("/users/:id/role", requireAuth("ADMIN"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;
    if (!["ADMIN", "EDITOR", "MEMBER"].includes(role)) return res.status(400).json({ error: "Invalid role" });
    const user = await prisma.user.update({ where: { id }, data: { role } as any });
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// approve / reject member
router.post("/users/:id/approve", requireAuth("ADMIN"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.update({ where: { id }, data: { approved: true } });
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

router.post("/users/:id/reject", requireAuth("ADMIN"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.update({ where: { id }, data: { approved: false } });
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
