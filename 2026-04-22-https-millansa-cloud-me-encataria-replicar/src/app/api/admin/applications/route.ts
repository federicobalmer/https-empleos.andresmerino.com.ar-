import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { CV_BUCKET } from "@/lib/constants";
import type { ApplicationWithJob } from "@/lib/types";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const jobId = searchParams.get("jobId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const supabaseAdmin = getSupabaseAdminClient();
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

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const items = (data ?? []) as ApplicationWithJob[];
  const enriched = await Promise.all(
    items.map(async (item) => {
      const signed = await supabaseAdmin.storage.from(CV_BUCKET).createSignedUrl(item.cv_path, 60 * 15);
      return {
        ...item,
        cv_signed_url: signed.data?.signedUrl ?? null
      };
    })
  );

  return NextResponse.json({ applications: enriched });
}
