import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Vacante no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ job: data });
}
