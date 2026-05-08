import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button, Input } from "@foodflow/ui";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { loginWithEmail } from "@/features/auth/services/auth-api";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { defaultRedirectPath, isAuthenticated } = useAuthSession();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      void navigate(defaultRedirectPath, { replace: true });
    }
  }, [defaultRedirectPath, isAuthenticated, navigate]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginWithEmail(values.email, values.password);
      void navigate("/app", { replace: true });
    } catch {
      form.setError("root", {
        message: "Invalid email or password"
      });
    }
  });

  return (
    <AuthShell
      title="Owner / Manager Login"
      description="Access your outlet operations, analytics, and administration."
      footer={
        <p>
          New owner?{" "}
          <Link to="/get-started" className="text-primary hover:underline">
            Create your workspace
          </Link>
          {" · "}
          <Link to="/login" className="text-muted-foreground hover:underline">
            Staff login
          </Link>
        </p>
      }
    >
      <motion.form
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        className="space-y-4"
        layout
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="owner@brand.com"
            {...form.register("email")}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...form.register("password")}
          />
        </div>

        {form.formState.errors.root?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in..." : "Continue"}
          <ArrowRight className="size-4" />
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button type="button" variant="outline" asChild>
            <Link to="/staff-login">
              <KeyRound className="size-4" />
              Staff Login
            </Link>
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link to="/platform/login">Platform</Link>
          </Button>
        </div>
      </motion.form>
    </AuthShell>
  );
}
