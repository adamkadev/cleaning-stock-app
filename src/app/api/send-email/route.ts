import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/core/services/mailService";

export async function POST(req: NextRequest) {
  try {
    const { building, floor, consumables } = await req.json();

    if (!building || floor === undefined || !consumables) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    await sendEmail(building, floor, consumables);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi mail :", err);
    return NextResponse.json({ error: "Impossible d'envoyer le mail" }, { status: 500 });
  }
}
