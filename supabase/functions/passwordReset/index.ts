import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const { email, token, newPassword } = await req.json();
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- STEP 1: Send token if only email is provided ---
    if (email && !token && !newPassword) {
      // Generate random token
      const resetToken = Math.random().toString(36).substr(2, 6).toUpperCase();

      // Save token in password_reset_tokens
      await supabaseAdmin
        .from("password_reset_tokens")
        .insert({ email, token: resetToken, created_at: new Date().toISOString() });

      // Here you can send the token via EmailJS or Supabase email
      // For simplicity, returning the token in response (for testing)
      return new Response(
        JSON.stringify({ success: true, message: "Token generated", token: resetToken }),
        { status: 200 }
      );
    }

    // --- STEP 2: Verify token & reset password ---
    if (email && token && newPassword) {
      // Verify token
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from("password_reset_tokens")
        .select("*")
        .eq("email", email)
        .eq("token", token)
        .single();

      if (tokenError || !tokenData) {
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
      }

      // Find user
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) return new Response(JSON.stringify({ error: listError.message }), { status: 400 });

      const user = users.users.find((u) => u.email === email);
      if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

      // Update password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });
      if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 400 });

      // Delete token
      await supabaseAdmin.from("password_reset_tokens").delete().eq("email", email);

      return new Response(JSON.stringify({ success: true, message: "Password reset successfully" }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
});
