import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="page-wrap">
      <div className="container panel stack">
        <p className="eyebrow">404</p>
        <h1 className="section-title">No encontramos esta pagina</h1>
        <p className="muted">Puede que la vacante haya sido cerrada o movida.</p>
        <Link className="button button-primary" href="/empleos">
          Volver a empleos
        </Link>
      </div>
    </section>
  );
}
