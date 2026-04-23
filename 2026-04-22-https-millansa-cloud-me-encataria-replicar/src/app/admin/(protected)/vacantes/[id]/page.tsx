import { notFound } from "next/navigation";
import { JOB_STATUS_LABELS, WORK_TYPE_LABELS } from "@/lib/constants";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { joinRequirements } from "@/lib/utils";
import { updateJobDetailsAction } from "@/app/admin/(protected)/actions";

type Props = {
  params: {
    id: string;
  };
};

export default async function AdminEditarVacantePage({ params }: Props) {
  const supabaseAdmin = getSupabaseAdminClient();
  const { data: job, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!job) {
    notFound();
  }

  return (
    <article className="panel stack">
      <div>
        <p className="eyebrow">Edicion</p>
        <h2 className="section-title">Editar vacante</h2>
      </div>
      <form action={updateJobDetailsAction} className="stack">
        <input type="hidden" name="id" value={job.id} />
        <div className="field">
          <label htmlFor="title">Titulo</label>
          <input id="title" name="title" required defaultValue={job.title} />
        </div>
        <div className="field">
          <label htmlFor="location">Ubicacion</label>
          <input id="location" name="location" required defaultValue={job.location} />
        </div>
        <div className="field">
          <label htmlFor="work_type">Tipo de jornada</label>
          <select id="work_type" name="work_type" defaultValue={job.work_type}>
            {Object.entries(WORK_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="summary">Resumen corto</label>
          <textarea id="summary" name="summary" required defaultValue={job.summary} />
        </div>
        <div className="field">
          <label htmlFor="description">Descripcion</label>
          <textarea id="description" name="description" required defaultValue={job.description} />
        </div>
        <div className="field">
          <label htmlFor="requirements">Requisitos (uno por linea)</label>
          <textarea
            id="requirements"
            name="requirements"
            required
            defaultValue={joinRequirements(job.requirements)}
          />
        </div>
        <div className="field">
          <label htmlFor="salary_range">Rango salarial</label>
          <input id="salary_range" name="salary_range" defaultValue={job.salary_range ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="status">Estado</label>
          <select id="status" name="status" defaultValue={job.status}>
            {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button className="button button-primary" type="submit">
          Guardar cambios
        </button>
      </form>
    </article>
  );
}
