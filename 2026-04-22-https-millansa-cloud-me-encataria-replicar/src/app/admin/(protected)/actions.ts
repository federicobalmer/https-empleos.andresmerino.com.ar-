"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPage } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  applicationStatusSchema,
  createJobSchema,
  jobStatusSchema,
  updateJobSchema,
  workTypeSchema
} from "@/lib/validation";
import { slugify, splitRequirements } from "@/lib/utils";

export async function createJobAction(formData: FormData) {
  await requireAdminPage();
  const supabaseAdmin = getSupabaseAdminClient();

  const requirements = splitRequirements(String(formData.get("requirements") ?? ""));
  const payload = createJobSchema.parse({
    title: String(formData.get("title") ?? ""),
    location: String(formData.get("location") ?? ""),
    work_type: workTypeSchema.parse(String(formData.get("work_type") ?? "full_time")),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    requirements,
    salary_range: String(formData.get("salary_range") ?? "") || null,
    status: jobStatusSchema.parse(String(formData.get("status") ?? "draft"))
  });

  const slug = slugify(payload.title);
  const publishedAt = payload.status === "published" ? new Date().toISOString() : null;

  const { error } = await supabaseAdmin.from("jobs").insert({
    ...payload,
    slug,
    published_at: publishedAt
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/empleos");
  revalidatePath("/admin/vacantes");
}

export async function updateJobAction(formData: FormData) {
  await requireAdminPage();
  const supabaseAdmin = getSupabaseAdminClient();

  const id = String(formData.get("id") ?? "");
  const status = jobStatusSchema.parse(String(formData.get("status") ?? "draft"));
  const title = String(formData.get("title") ?? "");

  const updatePayload: {
    status: "draft" | "published" | "paused" | "closed";
    published_at?: string | null;
    title?: string;
    slug?: string;
  } = {
    status
  };

  if (status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }

  if (title) {
    updatePayload.title = title;
    updatePayload.slug = slugify(title);
  }

  const { error } = await supabaseAdmin.from("jobs").update(updatePayload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/empleos");
  revalidatePath("/admin/vacantes");
}

export async function updateJobDetailsAction(formData: FormData) {
  await requireAdminPage();
  const supabaseAdmin = getSupabaseAdminClient();

  const id = String(formData.get("id") ?? "");
  const requirements = splitRequirements(String(formData.get("requirements") ?? ""));
  const parse = updateJobSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    location: String(formData.get("location") ?? ""),
    work_type: String(formData.get("work_type") ?? "full_time"),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    requirements,
    salary_range: String(formData.get("salary_range") ?? "") || null,
    status: String(formData.get("status") ?? "draft")
  });

  if (!parse.success) {
    throw new Error(parse.error.errors[0]?.message ?? "Datos invalidos");
  }

  const payload = parse.data;
  const updatePayload: Record<string, unknown> = {
    ...payload
  };

  if (payload.title) {
    updatePayload.slug = slugify(payload.title);
  }
  if (payload.status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin.from("jobs").update(updatePayload).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/empleos");
  revalidatePath("/admin/vacantes");
}

export async function deleteJobAction(formData: FormData) {
  await requireAdminPage();
  const supabaseAdmin = getSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabaseAdmin.from("jobs").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/empleos");
  revalidatePath("/admin/vacantes");
}

export async function updateApplicationStatusAction(formData: FormData) {
  await requireAdminPage();
  const supabaseAdmin = getSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  const status = applicationStatusSchema.parse(String(formData.get("status") ?? "nuevo"));

  const { error } = await supabaseAdmin
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/postulaciones");
}
