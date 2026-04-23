import Link from "next/link";
import { listJobs } from "@/lib/data/jobs";
import { JobCard } from "@/components/job-card";

export default async function HomePage() {
  const jobs = await listJobs();
  const highlightedJobs = jobs.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Portal de empleo</p>
            <h1>Sumate al equipo de Andres Merino</h1>
            <p>
              Buscamos personas con energia, criterio y ganas de crecer. Si queres impactar
              en una operacion con presencia nacional, este es tu lugar.
            </p>
            <div className="chip-row" style={{ marginTop: "1rem" }}>
              <Link className="button button-primary" href="/empleos">
                Ver vacantes
              </Link>
              <a className="button button-ghost" href="#contacto">
                Contacto
              </a>
            </div>
          </div>

          <div className="hero-stats">
            <article className="stat-card">
              <strong>+120</strong>
              <span className="muted">Sucursales activas en Argentina</span>
            </article>
            <article className="stat-card">
              <strong>+7000</strong>
              <span className="muted">Colaboradores en la operacion</span>
            </article>
            <article className="stat-card">
              <strong>+50 anos</strong>
              <span className="muted">Trayectoria en crecimiento sostenido</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Vacantes destacadas</h2>
          <p className="section-lead">
            Estas son algunas posiciones abiertas hoy. Si no encontras tu rol ideal, igualmente
            te invitamos a seguirnos y volver pronto.
          </p>
          {highlightedJobs.length ? (
            <div className="card-grid">
              {highlightedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <article className="panel">
              <p className="muted">Aun no hay vacantes publicadas.</p>
            </article>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container panel">
          <p className="eyebrow">Sobre nosotros</p>
          <h2 className="section-title">Una cultura de equipo y resultados</h2>
          <p className="section-lead" style={{ marginBottom: 0 }}>
            En Andres Merino priorizamos el respeto, el trabajo colaborativo y la mejora
            continua. Queremos sumar perfiles curiosos que entiendan al cliente y que disfruten
            resolver desafios reales.
          </p>
        </div>
      </section>
    </>
  );
}
