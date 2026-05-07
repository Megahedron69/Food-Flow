import { Outlet } from "react-router-dom";
import { SidebarNav } from "@/components/navigation/sidebar-nav";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarNav />
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
