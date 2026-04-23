import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const location = searchParams.get("location")?.trim();
  const workType = searchParams.get("workType")?.trim();

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  if (workType) {
    query = query.eq("work_type", workType);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ jobs: data ?? [] });
}
