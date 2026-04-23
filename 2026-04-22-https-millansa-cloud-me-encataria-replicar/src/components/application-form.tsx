"use client";

import { useState, type FormEvent } from "react";
import { ALLOWED_CV_TYPES, MAX_CV_SIZE_BYTES } from "@/lib/constants";

type Props = {
  jobId: string;
};

export function ApplicationForm({ jobId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("jobId", jobId);

    const cv = formData.get("cv");
    if (!(cv instanceof File) || !cv.size) {
      setError("Adjunta tu CV antes de enviar.");
      setLoading(false);
      return;
    }

    if (!ALLOWED_CV_TYPES.includes(cv.type)) {
      setError("Formato invalido. Usa PDF o Word.");
      setLoading(false);
      return;
    }

    if (cv.size > MAX_CV_SIZE_BYTES) {
      setError("El CV supera el limite de 5MB.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; ok?: boolean }
        | null;

      if (!response.ok) {
        setError(payload?.error ?? "No pudimos enviar tu postulacion.");
        return;
      }

      form.reset();
      setSuccess("Postulacion enviada con exito. Pronto nos contactaremos.");
    } catch {
      setError("Ocurrio un error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="stack">
      <div className="field">
        <label htmlFor="fullName">Nombre completo</label>
        <input id="fullName" name="fullName" required minLength={3} maxLength={120} />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required maxLength={120} />
      </div>

      <div className="field">
        <label htmlFor="phone">Telefono</label>
        <input id="phone" name="phone" required minLength={6} maxLength={30} />
      </div>

      <div className="field">
        <label htmlFor="city">Ciudad</label>
        <input id="city" name="city" required minLength={2} maxLength={80} />
      </div>

      <div className="field">
        <label htmlFor="cv">CV (PDF o Word, max 5MB)</label>
        <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" required />
      </div>

      <div className="field">
        <label htmlFor="message">Mensaje (opcional)</label>
        <textarea id="message" name="message" maxLength={1000} />
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <button type="submit" className="button button-primary" disabled={loading}>
        {loading ? "Enviando..." : "Postularme"}
      </button>
    </form>
  );
}
