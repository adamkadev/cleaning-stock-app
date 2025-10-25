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

export const getHtmlTemplate = (building: string, floor: string, consumables: string[]) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://allianceservicesproprete.github.io/logo.png" alt="Alliance Service Propreté" width="150" />
    </div>
    <h2 style="color: #2E7D32;">Nouveau signalement</h2>
    <p>Un nouveau signalement a été créé :</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Bâtiment</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${building}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Étage</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${floor}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Consommables</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${consumables.join(", ")}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString("fr-FR")}</td>
      </tr>
    </table>
    <p style="margin-top: 20px;">Merci de traiter ce signalement rapidement.</p>
  </div>
`;

export const sendEmail = async (building: string, floor: string, consumables: string[]) => {
  const html = getHtmlTemplate(building, floor, consumables);
  const subject = `Nouveau signalement - ${building} (Étage ${floor})`;

  await transporter.sendMail({
    from: `"Alliance Service Propreté" <${MAIL_USER}>`,
    to: MAIL_TO,
    subject,
    html,
  });
};
