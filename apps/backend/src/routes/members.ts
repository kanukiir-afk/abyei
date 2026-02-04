import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";
import { requireAuth } from "../middleware/auth";
const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  tribe: z.string().optional(),
  interests: z.string().optional()
});

router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    // create user and member record (unapproved by default)
    const user = await prisma.user.create({ data: { email: data.email, name: data.fullName, phone: data.phone, approved: false } });
    await prisma.member.create({ data: { userId: user.id, location: data.location, tribe: data.tribe, interests: data.interests } });
    // TODO: send confirmation email
    return res.json({ ok: true, message: "Registration submitted" });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// Admin: approve member
router.post("/:userId/approve", requireAuth("ADMIN"), async (req, res) => {
  try {
    const userId = String(req.params.userId);
    await prisma.user.update({ where: { id: userId }, data: { approved: true } });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// Public: search approved members
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const members = await prisma.member.findMany({
      where: {
        user: {
          approved: true,
          OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }]
        }
      },
      include: { user: true }
    });
    return res.json({ members });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
