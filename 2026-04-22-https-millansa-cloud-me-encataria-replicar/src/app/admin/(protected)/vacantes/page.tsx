import Link from "next/link";
import { JOB_STATUS_LABELS, WORK_TYPE_LABELS } from "@/lib/constants";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Job } from "@/lib/types";
import { createJobAction, deleteJobAction, updateJobAction } from "@/app/admin/(protected)/actions";
import { formatDate } from "@/lib/utils";

export default async function AdminVacantesPage() {
  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const jobs = (data ?? []) as Job[];

  return (
    <div className="stack">
      <article className="panel stack">
        <div>
          <p className="eyebrow">Nueva vacante</p>
          <h2 className="section-title">Crear publicacion</h2>
        </div>
        <form action={createJobAction} className="stack">
          <div className="field">
            <label htmlFor="title">Titulo</label>
            <input id="title" name="title" required />
          </div>
          <div className="field">
            <label htmlFor="location">Ubicacion</label>
            <input id="location" name="location" required />
          </div>
          <div className="field">
            <label htmlFor="work_type">Tipo de jornada</label>
            <select id="work_type" name="work_type" required defaultValue="full_time">
              {Object.entries(WORK_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="summary">Resumen corto</label>
            <textarea id="summary" name="summary" required minLength={20} maxLength={240} />
          </div>
          <div className="field">
            <label htmlFor="description">Descripcion</label>
            <textarea id="description" name="description" required minLength={50} />
          </div>
          <div className="field">
            <label htmlFor="requirements">Requisitos (uno por linea)</label>
            <textarea
              id="requirements"
              name="requirements"
              required
              placeholder={"Experiencia minima de 2 anos\nComunicacion efectiva\nManejo de herramientas digitales"}
            />
          </div>
          <div className="field">
            <label htmlFor="salary_range">Rango salarial (opcional)</label>
            <input id="salary_range" name="salary_range" />
          </div>
          <div className="field">
            <label htmlFor="status">Estado inicial</label>
            <select id="status" name="status" defaultValue="draft">
              {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button className="button button-primary" type="submit">
            Guardar vacante
          </button>
        </form>
      </article>

      <article className="panel stack">
        <div>
          <p className="eyebrow">Gestion</p>
          <h2 className="section-title">Vacantes cargadas</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Ubicacion</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{WORK_TYPE_LABELS[job.work_type]}</td>
                  <td>{JOB_STATUS_LABELS[job.status]}</td>
                  <td>{formatDate(job.created_at)}</td>
                  <td>
                    <div className="chip-row">
                      <form action={updateJobAction}>
                        <input type="hidden" name="id" value={job.id} />
                        <input type="hidden" name="title" value={job.title} />
                        <input type="hidden" name="status" value="published" />
                        <button className="button button-ghost" type="submit">
                          Publicar
                        </button>
                      </form>
                      <form action={updateJobAction}>
                        <input type="hidden" name="id" value={job.id} />
                        <input type="hidden" name="title" value={job.title} />
                        <input type="hidden" name="status" value="paused" />
                        <button className="button button-ghost" type="submit">
                          Pausar
                        </button>
                      </form>
                      <form action={updateJobAction}>
                        <input type="hidden" name="id" value={job.id} />
                        <input type="hidden" name="title" value={job.title} />
                        <input type="hidden" name="status" value="closed" />
                        <button className="button button-ghost" type="submit">
                          Cerrar
                        </button>
                      </form>
                      <Link className="button button-ghost" href={`/admin/vacantes/${job.id}`}>
                        Editar
                      </Link>
                      <form action={deleteJobAction}>
                        <input type="hidden" name="id" value={job.id} />
                        <button className="button button-ghost" type="submit">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!jobs.length ? (
                <tr>
                  <td colSpan={6} className="muted">
                    Aun no cargaste vacantes.
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
