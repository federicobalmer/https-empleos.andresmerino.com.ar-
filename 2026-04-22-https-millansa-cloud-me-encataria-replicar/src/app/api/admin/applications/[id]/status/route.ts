import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { updateApplicationStatusSchema } from "@/lib/validation";

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
  const parse = updateApplicationStatusSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message ?? "Payload invalido" },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("applications")
    .update({ status: parse.data.status })
    .eq("id", params.id)
    .select("id,status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ application: data });
}
