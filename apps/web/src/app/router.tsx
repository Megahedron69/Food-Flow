import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardPage } from "@/routes/dashboard";
import { SignInPage } from "@/routes/sign-in";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      }
    ]
  }
]);
