import { z } from "zod";
import { ALLOWED_CV_TYPES, MAX_CV_SIZE_BYTES } from "@/lib/constants";

export const workTypeSchema = z.enum([
  "full_time",
  "part_time",
  "hybrid",
  "remote"
]);
export const jobStatusSchema = z.enum([
  "draft",
  "published",
  "paused",
  "closed"
]);
export const applicationStatusSchema = z.enum([
  "nuevo",
  "en_revision",
  "entrevista",
  "rechazado",
  "contratado"
]);

export const createJobSchema = z.object({
  title: z.string().min(4).max(120),
  location: z.string().min(2).max(120),
  work_type: workTypeSchema,
  summary: z.string().min(20).max(240),
  description: z.string().min(50).max(5000),
  requirements: z.array(z.string().min(2)).min(1).max(30),
  salary_range: z.string().max(80).optional().nullable(),
  status: jobStatusSchema.default("draft")
});

export const updateJobSchema = createJobSchema.partial().extend({
  slug: z.string().min(3).max(100).optional()
});

export const createApplicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().min(3).max(120),
  email: z.string().email().max(120),
  phone: z.string().min(6).max(30),
  city: z.string().min(2).max(80),
  message: z.string().max(1000).optional().nullable()
});

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema
});

export function validateCvFile(file: File): { valid: boolean; message?: string } {
  if (!ALLOWED_CV_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Formato de CV invalido. Solo PDF o Word."
    };
  }

  if (file.size > MAX_CV_SIZE_BYTES) {
    return {
      valid: false,
      message: "El CV supera el limite de 5MB."
    };
  }

  return { valid: true };
}
