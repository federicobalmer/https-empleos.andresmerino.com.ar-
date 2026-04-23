import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/types";

type JobFilters = {
  search?: string;
  location?: string;
  workType?: string;
  includeUnpublished?: boolean;
};

export async function listJobs(filters: JobFilters = {}): Promise<Job[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (!filters.includeUnpublished) {
    query = query.eq("status", "published");
  }

  if (filters.search) {
    const search = filters.search.trim();
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location.trim()}%`);
  }

  if (filters.workType) {
    query = query.eq("work_type", filters.workType);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Error obteniendo vacantes: ${error.message}`);
  }

  return (data ?? []) as Job[];
}

export async function getJobBySlug(slug: string, includeUnpublished = false) {
  const supabase = createServerSupabaseClient();

  let query = supabase.from("jobs").select("*").eq("slug", slug);
  if (!includeUnpublished) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`Error obteniendo vacante: ${error.message}`);
  }

  return data as Job | null;
}
