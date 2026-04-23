import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createApplicationSchema, validateCvFile } from "@/lib/validation";
import { CV_BUCKET } from "@/lib/constants";
import { sendApplicationNotification } from "@/lib/email";
import type { Job } from "@/lib/types";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("cv");

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "CV requerido" }, { status: 400 });
  }

  const fileValidation = validateCvFile(file);
  if (!fileValidation.valid) {
    return NextResponse.json({ error: fileValidation.message }, { status: 400 });
  }

  const parse = createApplicationSchema.safeParse({
    jobId: String(formData.get("jobId") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    city: String(formData.get("city") ?? ""),
    message: String(formData.get("message") ?? "")
  });

  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message ?? "Datos invalidos" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", parse.data.jobId)
    .eq("status", "published")
    .maybeSingle();

  if (jobError || !job) {
    return NextResponse.json({ error: "Vacante invalida" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${parse.data.jobId}/${Date.now()}-${safeName}`;

  const upload = await supabaseAdmin.storage
    .from(CV_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  const insert = await supabaseAdmin.from("applications").insert({
    job_id: parse.data.jobId,
    full_name: parse.data.fullName,
    email: parse.data.email,
    phone: parse.data.phone,
    city: parse.data.city,
    message: parse.data.message || null,
    cv_path: path,
    cv_filename: file.name
  });

  if (insert.error) {
    await supabaseAdmin.storage.from(CV_BUCKET).remove([path]);
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  await sendApplicationNotification({
    job: job as Job,
    fullName: parse.data.fullName,
    email: parse.data.email,
    phone: parse.data.phone,
    city: parse.data.city,
    message: parse.data.message ?? undefined
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
