import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

async function isUserAdmin(userId: string) {
  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data);
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  return isUserAdmin(user.id);
}

export async function requireAdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}

export async function requireAdminApi() {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false as const, status: 401, message: "No autenticado" };
  }

  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return { ok: false as const, status: 403, message: "No autorizado" };
  }

  return { ok: true as const, user };
}
