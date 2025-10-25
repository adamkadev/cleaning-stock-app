import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_TO = process.env.MAIL_TO;

if (!MAIL_USER || !MAIL_PASS || !MAIL_TO) {
  throw new Error("Merci de définir MAIL_USER, MAIL_PASS et MAIL_TO dans .env.local");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { building, floor, consumables } = await req.json();

    if (!building || !floor || !consumables) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const subject = `Nouveau signalement - ${building} (Étage ${floor})`;
    const text = `
Un nouveau signalement a été créé :

Bâtiment : ${building}
Étage : ${floor}
Consommables : ${consumables.join(", ")}
Date : ${new Date().toLocaleString("fr-FR")}
`;

    await transporter.sendMail({
      from: `"Alliance Service Propreté" <${MAIL_USER}>`,
      to: MAIL_TO,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi mail :", err);
    return NextResponse.json({ error: "Impossible d'envoyer le mail" }, { status: 500 });
  }
}
