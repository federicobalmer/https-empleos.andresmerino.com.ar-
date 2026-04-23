import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <section className="page-wrap">
      <div className="container stack">
        <div>
          <p className="eyebrow">Backoffice</p>
          <h1 className="section-title">Ingreso administradores</h1>
          <p className="section-lead">
            Acceso restringido al equipo de talento para gestionar vacantes y postulaciones.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </section>
  );
}
