"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "unauthorized"
      ? "Tu usuario no tiene permisos de administrador."
      : null
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Completa email y contrasena.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError("Credenciales invalidas.");
        return;
      }

      router.push("/admin/vacantes");
      router.refresh();
    } catch {
      setError("No fue posible iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel stack" style={{ maxWidth: 440 }}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="password">Contrasena</label>
        <input id="password" name="password" type="password" required />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="button button-primary" disabled={loading} type="submit">
        {loading ? "Ingresando..." : "Iniciar sesion"}
      </button>
    </form>
  );
}
