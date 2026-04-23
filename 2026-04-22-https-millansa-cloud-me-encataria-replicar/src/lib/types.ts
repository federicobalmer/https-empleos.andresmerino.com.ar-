export type JobStatus = "draft" | "published" | "paused" | "closed";
export type WorkType = "full_time" | "part_time" | "hybrid" | "remote";
export type ApplicationStatus =
  | "nuevo"
  | "en_revision"
  | "entrevista"
  | "rechazado"
  | "contratado";

export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string;
  work_type: WorkType;
  summary: string;
  description: string;
  requirements: string[];
  salary_range: string | null;
  status: JobStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  message: string | null;
  cv_path: string;
  cv_filename: string;
  status: ApplicationStatus;
  created_at: string;
};

export type ApplicationWithJob = Application & {
  jobs: {
    title: string;
    slug: string;
  } | null;
  cv_signed_url?: string | null;
};

export type CreateApplicationInput = {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message?: string;
};
