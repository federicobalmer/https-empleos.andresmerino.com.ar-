import Link from "next/link";
import type { Job } from "@/lib/types";
import { WORK_TYPE_LABELS } from "@/lib/constants";

type Props = {
  job: Job;
};

export function JobCard({ job }: Props) {
  return (
    <article className="job-card">
      <div>
        <p className="eyebrow">{WORK_TYPE_LABELS[job.work_type]}</p>
        <h3>{job.title}</h3>
      </div>
      <p className="muted">{job.summary}</p>
      <div className="chip-row">
        <span className="chip">{job.location}</span>
        {job.salary_range ? <span className="chip">{job.salary_range}</span> : null}
      </div>
      <Link className="button button-primary" href={`/empleos/${job.slug}`}>
        Ver vacante
      </Link>
    </article>
  );
}
