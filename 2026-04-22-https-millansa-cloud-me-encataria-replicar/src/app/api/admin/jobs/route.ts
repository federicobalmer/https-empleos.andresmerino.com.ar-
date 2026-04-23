import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createJobSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ jobs: data ?? [] });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const body = await request.json().catch(() => null);
  const parse = createJobSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message ?? "Payload invalido" },
      { status: 400 }
    );
  }

  const payload = parse.data;
  const slug = slugify(payload.title);
  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({
      ...payload,
      slug,
      published_at: payload.status === "published" ? new Date().toISOString() : null
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ job: data }, { status: 201 });
}
