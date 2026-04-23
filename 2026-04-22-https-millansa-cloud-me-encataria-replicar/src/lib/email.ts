import { Resend } from "resend";
import type { Job } from "@/lib/types";

type NotificationInput = {
  job: Job;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message?: string;
};

export async function sendApplicationNotification(input: NotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TALENT_EMAIL_TO;

  if (!apiKey || !to) {
    return { sent: false, reason: "Email no configurado" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "talento@andresmerino.com";

  await resend.emails.send({
    from,
    to: [to],
    subject: `Nueva postulacion: ${input.job.title}`,
    html: `
      <h2>Nueva postulacion recibida</h2>
      <p><strong>Vacante:</strong> ${escapeHtml(input.job.title)}</p>
      <p><strong>Candidato:</strong> ${escapeHtml(input.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(input.phone)}</p>
      <p><strong>Ciudad:</strong> ${escapeHtml(input.city)}</p>
      <p><strong>Mensaje:</strong> ${escapeHtml(input.message ?? "Sin mensaje")}</p>
    `
  });

  return { sent: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
