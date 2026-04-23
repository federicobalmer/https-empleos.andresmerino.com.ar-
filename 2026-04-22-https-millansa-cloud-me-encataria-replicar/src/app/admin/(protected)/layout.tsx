import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export default async function AdminProtectedLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireAdminPage();

  return (
    <section className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Panel admin</p>
          <h1 className="section-title" style={{ margin: 0 }}>
            Gestion de empleos
          </h1>
        </div>
        <div className="chip-row">
          <span className="pill-ok">Acceso verificado</span>
          <AdminLogoutButton />
        </div>
      </div>

      <nav className="admin-nav">
        <Link href="/admin/vacantes">Vacantes</Link>
        <Link href="/admin/postulaciones">Postulaciones</Link>
      </nav>

      <div style={{ marginTop: "1rem" }}>{children}</div>
    </section>
  );
}
