import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@foodflow/ui";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { loginWithEmail, logoutEmailSession } from "@/features/auth/services/auth-api";
import { supabase } from "@/lib/supabase";

const platformLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

type PlatformLoginForm = z.infer<typeof platformLoginSchema>;

export function PlatformLoginPage() {
  const navigate = useNavigate();
  const { identity } = useAuthSession();
  const profile = useAuthStore((state) => state.profile);

  const form = useForm<PlatformLoginForm>({
    resolver: zodResolver(platformLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (identity?.role === "platform_admin") {
      void navigate("/platform", { replace: true });
    }
  }, [identity?.role, navigate]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginWithEmail(values.email, values.password);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id ?? "")
        .single();

      if ((currentProfile?.role ?? profile?.role) !== "platform_admin") {
        await logoutEmailSession();
        form.setError("root", { message: "Platform admin access required" });
        return;
      }

      void navigate("/platform", { replace: true });
    } catch {
      form.setError("root", { message: "Invalid credentials" });
    }
  });

  return (
    <AuthShell
      title="Platform Admin Login"
      description="Restricted global access for FoodFlow operations and tenant governance."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label htmlFor="platform-email" className="text-sm font-medium">
            Email
          </label>
          <Input id="platform-email" type="email" {...form.register("email")} />
        </div>

        <div className="space-y-2">
          <label htmlFor="platform-password" className="text-sm font-medium">
            Password
          </label>
          <Input id="platform-password" type="password" {...form.register("password")} />
        </div>

        {form.formState.errors.root?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Verifying..." : "Access platform"}
        </Button>
      </form>
    </AuthShell>
  );
}
