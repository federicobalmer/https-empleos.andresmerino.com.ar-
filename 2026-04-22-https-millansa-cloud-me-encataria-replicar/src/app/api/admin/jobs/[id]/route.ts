import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { updateJobSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const body = await request.json().catch(() => null);
  const parse = updateJobSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message ?? "Payload invalido" },
      { status: 400 }
    );
  }

  const updateData = parse.data;
  const payload: Record<string, unknown> = { ...updateData };

  if (updateData.title) {
    payload.slug = updateData.slug ?? slugify(updateData.title);
  }
  if (updateData.status === "published") {
    payload.published_at = new Date().toISOString();
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .update(payload)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ job: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const { error } = await supabaseAdmin.from("jobs").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
