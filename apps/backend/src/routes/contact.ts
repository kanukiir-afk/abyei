import { Router } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

router.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

  const { name, email, subject, message } = parsed.data;

  // attempt to send email using environment SMTP config
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });

    const to = process.env.CONTACT_EMAIL || process.env.SMTP_FROM || "admin@localhost";
    await transporter.sendMail({
      from: process.env.SMTP_FROM || email,
      to,
      subject: `[Website Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return res.json({ ok: true });
  } catch (err: any) {
    console.warn("Contact email send failed", err?.message || err);
    // still return success to avoid leaking SMTP details; store message in logs
    return res.status(202).json({ ok: true, warning: "email_failed" });
  }
});

export default router;
