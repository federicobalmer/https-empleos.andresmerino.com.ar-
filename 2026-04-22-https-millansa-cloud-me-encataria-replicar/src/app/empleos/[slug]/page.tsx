import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/application-form";
import { getJobBySlug } from "@/lib/data/jobs";
import { WORK_TYPE_LABELS } from "@/lib/constants";

type Props = {
  params: {
    slug: string;
  };
};

export default async function EmpleoDetallePage({ params }: Props) {
  const job = await getJobBySlug(params.slug);
  if (!job) {
    notFound();
  }

  return (
    <section className="page-wrap">
      <div className="container detail-grid">
        <article className="panel stack">
          <div>
            <p className="eyebrow">{WORK_TYPE_LABELS[job.work_type]}</p>
            <h1 className="section-title">{job.title}</h1>
            <div className="chip-row">
              <span className="chip">{job.location}</span>
              {job.salary_range ? <span className="chip">{job.salary_range}</span> : null}
            </div>
          </div>
          <p>{job.description}</p>
          <div>
            <h3>Requisitos</h3>
            <ul>
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="panel stack">
          <div>
            <p className="eyebrow">Postulacion rapida</p>
            <h2>Deja tus datos</h2>
            <p className="muted">
              Completa el formulario y adjunta tu CV. Te contactaremos por email o telefono.
            </p>
          </div>
          <ApplicationForm jobId={job.id} />
        </aside>
      </div>
    </section>
  );
}
