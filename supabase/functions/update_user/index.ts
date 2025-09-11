import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Helper to extract user ID
async function getUserId(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = await getUserId(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await req.json();
  const { email, name, password, phone_number, avatar_base64 } = payload;

  // ---------- Update Auth ----------
  const authUpdates: any = {};
  if (email) authUpdates.email = email;
  if (password) authUpdates.password = password;
  if (phone_number) authUpdates.phone = phone_number;

  if (Object.keys(authUpdates).length > 0) {
    const { error: authErr } = await supabase.auth.admin.updateUserById(userId, authUpdates);
    if (authErr) {
      return new Response(JSON.stringify({ error: "Auth update failed", details: authErr.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
  }

  // ---------- Check Email Verification ----------
  if (email) {
    const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(userId);
    if (userErr) return new Response(JSON.stringify({ error: "Failed to verify email", details: userErr.message }), { status: 400, headers: { "Content-Type": "application/json" } });

    if (!userData?.user?.email_confirmed_at) {
      return new Response(JSON.stringify({
        error: "Email not verified",
        message: "Please verify your new email before applying other changes."
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
  }

  // ---------- Upload avatar ----------
  let avatarUrl: string | null = null;
  if (avatar_base64) {
    const binary = Uint8Array.from(atob(avatar_base64), (c) => c.charCodeAt(0));
    const filename = `avatars/${userId}-${crypto.randomUUID()}.png`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(filename, binary, { contentType: "image/png", upsert: true });
    if (uploadErr) {
      return new Response(JSON.stringify({ error: "Avatar upload failed", details: uploadErr.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    avatarUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${filename}`;
  }

  // ---------- Update profiles table ----------
  const profileUpdates: any = {};
  if (name) profileUpdates.full_name = name;
  if (email) profileUpdates.user_email = email;
  if (phone_number) profileUpdates.phone_number = phone_number;
  if (avatarUrl) profileUpdates.avatar_url = avatarUrl;

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileErr } = await supabase.from("profiles").update(profileUpdates).eq("user_id", userId);
    if (profileErr) {
      return new Response(JSON.stringify({ error: "Profile update failed", details: profileErr.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
  }

  return new Response(JSON.stringify({ success: true, avatar_url: avatarUrl ?? undefined }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
