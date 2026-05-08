import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Delete } from "lucide-react";
import { Button, Input } from "@foodflow/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { loginStaff } from "@/features/auth/services/auth-api";

const keypadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

export function StaffLoginPage() {
  const navigate = useNavigate();
  const isOnline = useAuthSession().isOnline;
  const setStaffSession = useAuthStore((state) => state.setStaffSession);
  const [pin, setPin] = useState("");
  const [outletCode, setOutletCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PIN_LENGTH = 4;
  const maskedPin = useMemo(() => pin.padEnd(PIN_LENGTH, "•").slice(0, PIN_LENGTH), [pin]);

  const handleKeyPress = (key: (typeof keypadKeys)[number]) => {
    if (isSubmitting) {
      return;
    }

    if (key === "") {
      return;
    }

    if (key === "back") {
      setPin((previous) => previous.slice(0, -1));
      return;
    }

    setPin((previous) => (previous.length < PIN_LENGTH ? `${previous}${key}` : previous));
  };
  const submit = async () => {
    if (!outletCode.trim() || pin.length < PIN_LENGTH) {
      setError("Enter outlet code and PIN");
      return;
    }
    console.log("submit clicked");

    setError(null);
    setIsSubmitting(true);
    console.log("[staff-login] submitting", { outletCode, pinLen: pin.length });

    try {
      const session = await loginStaff({
        outletCode,
        pin
      });

      console.log("[staff-login] session received", session);
      setStaffSession(session);
      const dest = session.assignedMode === "kds" ? "/kds" : "/pos";
      console.log("[staff-login] navigating to", dest);
      void navigate(dest, { replace: true });
    } catch (err) {
      console.error("[staff-login] error", err);
      setError(err instanceof Error ? err.message : "Invalid outlet code or PIN");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-6">
      <section className="w-full max-w-lg rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Staff Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fast PIN access for counter and kitchen workflows.
          </p>
        </header>

        {!isOnline ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
            <AlertTriangle className="size-4" />
            Offline. Staff login requires connectivity.
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="outlet-code" className="text-sm font-medium">
            Outlet code
          </label>
          <Input
            id="outlet-code"
            value={outletCode}
            onChange={(event) => {
              setOutletCode(event.target.value.toUpperCase());
            }}
            placeholder="BLR01"
            className="h-12 text-base"
            disabled={isSubmitting}
          />
        </div>

        <div className="mt-4 rounded-lg border bg-muted/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">PIN</p>
          <p className="mt-1 font-display text-3xl tracking-[0.35em]">{maskedPin}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {keypadKeys.map((key, index) => (
            <Button
              key={`${key}-${String(index)}`}
              type="button"
              variant={key === "back" ? "secondary" : "outline"}
              className="h-14 text-lg"
              onClick={() => {
                handleKeyPress(key);
              }}
              disabled={key === "" || isSubmitting}
            >
              {key === "back" ? <Delete className="size-5" /> : key}
            </Button>
          ))}
        </div>

        <AnimatePresence>
          {error ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 text-sm text-destructive"
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <Button
          type="button"
          onClick={() => {
            void submit();
          }}
          className="mt-4 h-12 w-full text-base"
          disabled={isSubmitting || !isOnline}
        >
          {isSubmitting ? "Signing in..." : "Continue to Shift"}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Owner or manager?{" "}
          <Link to="/owner-login" className="text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </section>
    </main>
  );
}
