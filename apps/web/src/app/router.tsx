import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardPage } from "@/routes/dashboard";
import { RouteAccessGuard } from "@/features/auth/components/route-access-guard";
import { GetStartedPage } from "@/routes/get-started";
import { KdsPage } from "@/routes/kds";
import { LandingPage } from "@/routes/landing";
import { LoginPage } from "@/routes/login";
import { PlatformLoginPage } from "@/routes/platform-login";
import { PlatformPage } from "@/routes/platform";
import { PosPage } from "@/routes/pos";
import { StaffLoginPage } from "@/routes/staff-login";
import { UnauthorizedPage } from "@/routes/unauthorized";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <StaffLoginPage />
  },
  {
    path: "/staff-login",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/owner-login",
    element: <LoginPage />
  },
  {
    path: "/sign-in",
    element: <Navigate to="/owner-login" replace />
  },
  {
    path: "/get-started",
    element: <GetStartedPage />
  },
  {
    path: "/platform/login",
    element: <PlatformLoginPage />
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />
  },
  {
    path: "/app",
    element: (
      <RouteAccessGuard roles={["owner", "manager"]} allowSessionTypes={["supabase"]}>
        <DashboardLayout />
      </RouteAccessGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      }
    ]
  },
  {
    path: "/pos",
    element: (
      <RouteAccessGuard roles={["staff"]} assignedMode="pos" allowSessionTypes={["staff"]}>
        <PosPage />
      </RouteAccessGuard>
    )
  },
  {
    path: "/kds",
    element: (
      <RouteAccessGuard roles={["staff"]} assignedMode="kds" allowSessionTypes={["staff"]}>
        <KdsPage />
      </RouteAccessGuard>
    )
  },
  {
    path: "/platform",
    element: (
      <RouteAccessGuard roles={["platform_admin"]} allowSessionTypes={["supabase"]}>
        <PlatformPage />
      </RouteAccessGuard>
    )
  }
]);
