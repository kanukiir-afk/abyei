import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../prismaClient";
import crypto from "crypto";
import nodemailer from "nodemailer";
const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) return res.status(400).json({ error: "Email taken" });
    const hashed = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({ data: { email: parsed.email, name: parsed.name, phone: parsed.phone, passwordHash: hashed } });
    // create verification token
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await prisma.verificationToken.create({ data: { token, userId: user.id, expiresAt } });
    // send confirmation email (requires SMTP env set)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: !!process.env.SMTP_SECURE,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined
      });
      const confirmUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/confirm?token=${token}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "no-reply@example.com",
        to: user.email,
        subject: "Confirm your membership registration",
        text: `Please confirm your registration: ${confirmUrl}`,
        html: `<p>Please confirm your registration: <a href="${confirmUrl}">Confirm</a></p>`
      });
    } catch (e) {
      console.warn("Email send failed", e);
    }
    return res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: (err as Error).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(401).json({ error: "Invalid" });
    const hash = user.passwordHash;
    const ok = hash ? await bcrypt.compare(parsed.password, hash) : false;
    if (!ok) return res.status(401).json({ error: "Invalid" });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || "dev", { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: (err as Error).message });
  }
});

// confirm token
router.get("/confirm", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    const vt = await prisma.verificationToken.findUnique({ where: { token } });
    if (!vt || vt.expiresAt < new Date()) return res.status(400).send("Invalid or expired token");
    await prisma.user.update({ where: { id: vt.userId }, data: { approved: true } });
    await prisma.verificationToken.delete({ where: { id: vt.id } });
    return res.send("Email confirmed. You may close this window.");
  } catch (err) {
    return res.status(500).send("Error");
  }
});

export default router;
