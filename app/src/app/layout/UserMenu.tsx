import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { useCurrentUser, userDisplayName, userInitials } from "../../features/profile/useCurrentUser";
import { useT } from "../../lib/i18n/LocalizationProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../shared/ui/dropdown-menu";

export function UserMenu({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { status, logout } = useAuth();
  const { t } = useT();
  const me = useCurrentUser();
  const profile = me.data?.data;
  const name = userDisplayName(profile) || (me.isLoading ? "Loading..." : "Guest");
  const roles = profile?.roles ?? [];

  function handleLogout() {
    logout();
    onNavigate("/login");
  }

  if (status !== "authenticated") {
    return (
      <button
        onClick={() => onNavigate(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-volt-400 text-zinc-950 font-bold text-xs hover:bg-volt-300 transition-colors shadow-sm cursor-pointer ml-1"
      >
        <LogIn size={14} />
        <span>{t("auth.signIn", "Sign In")}</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="user-menu-trigger" aria-label="Open user menu">
        <span className="avatar avatar-sm">{userInitials(profile)}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[280px]">
        <DropdownMenuLabel className="flex items-center gap-3 font-normal">
          <span className="avatar avatar-lg">{userInitials(profile)}</span>
          <div className="grid gap-0.5 overflow-hidden">
            <strong className="truncate text-sm font-semibold">{name}</strong>
            {profile?.email ? <small className="truncate text-xs text-[hsl(var(--muted-foreground))]">{profile.email}</small> : null}
            {roles.length > 0 ? <small className="truncate text-xs capitalize text-[hsl(var(--muted-foreground))]">{roles.join(", ")}</small> : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={handleLogout}>
          <LogOut size={18} /> {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
