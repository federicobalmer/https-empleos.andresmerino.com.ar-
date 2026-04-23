import { listJobs } from "@/lib/data/jobs";
import { JobCard } from "@/components/job-card";
import { WORK_TYPE_LABELS } from "@/lib/constants";

type Props = {
  searchParams?: {
    search?: string;
    location?: string;
    workType?: string;
  };
};

export default async function EmpleosPage({ searchParams }: Props) {
  const search = searchParams?.search ?? "";
  const location = searchParams?.location ?? "";
  const workType = searchParams?.workType ?? "";

  const jobs = await listJobs({ search, location, workType });

  return (
    <section className="page-wrap">
      <div className="container stack">
        <div>
          <p className="eyebrow">Busqueda de vacantes</p>
          <h1 className="section-title">Empleos disponibles</h1>
          <p className="section-lead">
            Filtra por palabra clave, ubicacion o modalidad y encontra tu proximo desafio.
          </p>
        </div>

        <form className="filters" method="GET">
          <div className="field">
            <label htmlFor="search">Busqueda</label>
            <input
              id="search"
              name="search"
              placeholder="Ej: comercial, logistica"
              defaultValue={search}
            />
          </div>
          <div className="field">
            <label htmlFor="location">Ubicacion</label>
            <input
              id="location"
              name="location"
              placeholder="Ej: Mendoza"
              defaultValue={location}
            />
          </div>
          <div className="field">
            <label htmlFor="workType">Tipo de jornada</label>
            <select id="workType" name="workType" defaultValue={workType}>
              <option value="">Todas</option>
              {Object.entries(WORK_TYPE_LABELS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ alignSelf: "end" }}>
            <button className="button button-primary" type="submit">
              Buscar
            </button>
          </div>
        </form>

        {jobs.length ? (
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <article className="panel">
            <h3>No encontramos vacantes con esos filtros.</h3>
            <p className="muted">Proba limpiando busqueda o ubicacion.</p>
          </article>
        )}
      </div>
    </section>
  );
}
