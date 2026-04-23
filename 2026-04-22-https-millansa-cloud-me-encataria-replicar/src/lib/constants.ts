export const APP_NAME = "Portal de Empleos Andres Merino";
export const CV_BUCKET = process.env.SUPABASE_CV_BUCKET ?? "cvs";
export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export const APPLICATION_STATUS_LABELS = {
  nuevo: "Nuevo",
  en_revision: "En revision",
  entrevista: "Entrevista",
  rechazado: "Rechazado",
  contratado: "Contratado"
} as const;

export const JOB_STATUS_LABELS = {
  draft: "Borrador",
  published: "Publicada",
  paused: "Pausada",
  closed: "Cerrada"
} as const;

export const WORK_TYPE_LABELS = {
  full_time: "Tiempo completo",
  part_time: "Medio tiempo",
  hybrid: "Hibrido",
  remote: "Remoto"
} as const;
