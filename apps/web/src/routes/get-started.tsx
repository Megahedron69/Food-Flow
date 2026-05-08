import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Input } from "@foodflow/ui";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { loginWithEmail, signupOwner } from "@/features/auth/services/auth-api";

const getStartedSchema = z.object({
  companyName: z.string().min(2).max(120),
  companySlug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  outletName: z.string().min(2).max(120),
  outletCode: z
    .string()
    .min(2)
    .max(24)
    .regex(/^[a-zA-Z0-9-]+$/),
  outletAddress: z.string().max(240).optional(),
  ownerName: z.string().min(2).max(120),
  ownerEmail: z.email(),
  ownerPassword: z.string().min(8)
});

type GetStartedForm = z.infer<typeof getStartedSchema>;

const steps = ["Company", "Outlet", "Owner"] as const;

export function GetStartedPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const form = useForm<GetStartedForm>({
    resolver: zodResolver(getStartedSchema),
    defaultValues: {
      companyName: "",
      companySlug: "",
      outletName: "",
      outletCode: "",
      outletAddress: "",
      ownerName: "",
      ownerEmail: "",
      ownerPassword: ""
    }
  });

  const title = useMemo(() => {
    const activeStep = steps[step] ?? "Company";
    return `Get Started · ${activeStep}`;
  }, [step]);

  const nextStep = async () => {
    const fieldsByStep: Array<Array<keyof GetStartedForm>> = [
      ["companyName", "companySlug"],
      ["outletName", "outletCode", "outletAddress"],
      ["ownerName", "ownerEmail", "ownerPassword"]
    ];

    const valid = await form.trigger(fieldsByStep[step]);
    if (!valid) {
      return;
    }

    setStep((previous) => Math.min(previous + 1, steps.length - 1));
  };

  const submit = form.handleSubmit(async (values) => {
    try {
      await signupOwner({
        tenant: {
          name: values.companyName,
          slug: values.companySlug,
          plan: "starter"
        },
        outlet: {
          name: values.outletName,
          code: values.outletCode,
          ...(values.outletAddress ? { address: values.outletAddress } : {})
        },
        owner: {
          full_name: values.ownerName,
          email: values.ownerEmail,
          password: values.ownerPassword
        }
      });

      await loginWithEmail(values.ownerEmail, values.ownerPassword);
      void navigate("/app", { replace: true });
    } catch {
      form.setError("root", { message: "Unable to complete setup. Check inputs and retry." });
    }
  });

  return (
    <AuthShell
      title={title}
      description="Create your tenant, first outlet, and owner workspace in under two minutes."
      className="max-w-xl"
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Already have an account?
        </Link>
      }
    >
      <div className="mb-6 flex items-center gap-2">
        {steps.map((stepName, index) => (
          <div key={stepName} className="flex items-center gap-2">
            <span
              className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${
                index <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>
            <span className="text-xs text-muted-foreground">{stepName}</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        className="space-y-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {step === 0 ? (
              <>
                <Field label="Company name" id="companyName">
                  <Input id="companyName" {...form.register("companyName")} />
                </Field>
                <Field label="Company slug" id="companySlug">
                  <Input
                    id="companySlug"
                    placeholder="my-brand"
                    {...form.register("companySlug")}
                  />
                </Field>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Field label="Outlet name" id="outletName">
                  <Input id="outletName" {...form.register("outletName")} />
                </Field>
                <Field label="Outlet code" id="outletCode">
                  <Input id="outletCode" placeholder="BLR01" {...form.register("outletCode")} />
                </Field>
                <Field label="Address" id="outletAddress">
                  <Input id="outletAddress" {...form.register("outletAddress")} />
                </Field>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Field label="Owner name" id="ownerName">
                  <Input id="ownerName" {...form.register("ownerName")} />
                </Field>
                <Field label="Owner email" id="ownerEmail">
                  <Input id="ownerEmail" type="email" {...form.register("ownerEmail")} />
                </Field>
                <Field label="Password" id="ownerPassword">
                  <Input id="ownerPassword" type="password" {...form.register("ownerPassword")} />
                </Field>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {form.formState.errors.root?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStep((previous) => Math.max(previous - 1, 0));
            }}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => {
                void nextStep();
              }}
            >
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Setting up..." : "Create Workspace"}
            </Button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}

type FieldProps = {
  label: string;
  id: string;
  children: ReactNode;
};

function Field({ label, id, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
