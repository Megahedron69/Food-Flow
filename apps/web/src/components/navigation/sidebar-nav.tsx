import { BarChart3Icon, LayoutDashboardIcon, SettingsIcon, StoreIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@foodflow/lib";
import { Button, Separator } from "@foodflow/ui";
import { appNavigation } from "@/constants/navigation";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { logoutEmailSession } from "@/features/auth/services/auth-api";

const iconMap = {
  dashboard: LayoutDashboardIcon,
  outlets: StoreIcon,
  reports: BarChart3Icon,
  settings: SettingsIcon
};

export function SidebarNav() {
  const { profile } = useAuth();

  const onLogout = async () => {
    await logoutEmailSession();
  };

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6">
          <span className="text-base font-semibold">FoodFlow</span>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {appNavigation.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )
                }
              >
                <Icon data-icon="inline-start" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <p className="truncate text-sm font-medium">{profile?.full_name ?? "Signed in"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {profile?.email ?? "Operational workspace"}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            onClick={() => void onLogout()}
          >
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
