import { APPLICATION_STATUS_LABELS, CV_BUCKET } from "@/lib/constants";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { updateApplicationStatusAction } from "@/app/admin/(protected)/actions";
import type { ApplicationStatus, ApplicationWithJob } from "@/lib/types";

type Props = {
  searchParams?: {
    status?: ApplicationStatus;
    jobId?: string;
    from?: string;
    to?: string;
  };
};

export default async function AdminPostulacionesPage({ searchParams }: Props) {
  const supabaseAdmin = getSupabaseAdminClient();
  const status = searchParams?.status;
  const jobId = searchParams?.jobId;
  const from = searchParams?.from;
  const to = searchParams?.to;

  let query = supabaseAdmin
    .from("applications")
    .select(
      "id,job_id,full_name,email,phone,city,message,cv_path,cv_filename,status,created_at,jobs(title,slug)"
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }
  if (jobId) {
    query = query.eq("job_id", jobId);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59`);
  }

  const [{ data: applicationsRaw, error: applicationsError }, { data: jobs, error: jobsError }] =
    await Promise.all([
      query,
      supabaseAdmin.from("jobs").select("id,title").order("title", { ascending: true })
    ]);

  if (applicationsError) {
    throw new Error(applicationsError.message);
  }
  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const applications = (applicationsRaw ?? []) as ApplicationWithJob[];

  const applicationsWithSignedUrl = await Promise.all(
    applications.map(async (item) => {
      const signed = await supabaseAdmin.storage
        .from(CV_BUCKET)
        .createSignedUrl(item.cv_path, 60 * 15);

      return {
        ...item,
        cv_signed_url: signed.data?.signedUrl ?? null
      };
    })
  );

  return (
    <div className="stack">
      <article className="panel stack">
        <div>
          <p className="eyebrow">Filtros</p>
          <h2 className="section-title">Postulaciones recibidas</h2>
        </div>
        <form className="filters" method="GET">
          <div className="field">
            <label htmlFor="status">Estado</label>
            <select id="status" name="status" defaultValue={status ?? ""}>
              <option value="">Todos</option>
              {Object.entries(APPLICATION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="jobId">Vacante</label>
            <select id="jobId" name="jobId" defaultValue={jobId ?? ""}>
              <option value="">Todas</option>
              {(jobs ?? []).map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="from">Desde</label>
            <input id="from" type="date" name="from" defaultValue={from ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="to">Hasta</label>
            <input id="to" type="date" name="to" defaultValue={to ?? ""} />
          </div>
          <div className="field" style={{ alignSelf: "end" }}>
            <button className="button button-primary" type="submit">
              Aplicar filtros
            </button>
          </div>
        </form>
      </article>

      <article className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Vacante</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>CV</th>
                <th>Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {applicationsWithSignedUrl.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.city}</div>
                  </td>
                  <td>{item.jobs?.title ?? "Vacante eliminada"}</td>
                  <td>
                    <div>{item.email}</div>
                    <div className="muted">{item.phone}</div>
                  </td>
                  <td>{APPLICATION_STATUS_LABELS[item.status]}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    {item.cv_signed_url ? (
                      <a
                        className="button button-ghost"
                        href={item.cv_signed_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir CV
                      </a>
                    ) : (
                      <span className="muted">Sin archivo</span>
                    )}
                  </td>
                  <td>
                    <form action={updateApplicationStatusAction} className="chip-row">
                      <input type="hidden" name="id" value={item.id} />
                      <select name="status" defaultValue={item.status}>
                        {Object.entries(APPLICATION_STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button className="button button-ghost" type="submit">
                        Guardar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {!applicationsWithSignedUrl.length ? (
                <tr>
                  <td colSpan={7} className="muted">
                    No hay postulaciones para los filtros seleccionados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
