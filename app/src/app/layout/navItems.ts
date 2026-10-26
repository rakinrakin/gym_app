import { Flame, Globe2, UserRound, Users } from "lucide-react";
import type { TranslationKey } from "../../lib/i18n/dictionary";

export interface NavItem {
  href: string;
  label: string;
  translationKey: TranslationKey;
  icon: typeof Flame;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", translationKey: "nav.dashboard", icon: Flame },
  { href: "/explore", label: "Worldwide Feed", translationKey: "nav.explore", icon: Globe2 },
  { href: "/runners", label: "Global Runners", translationKey: "nav.runners", icon: Users },
  { href: "/profile", label: "My Profile", translationKey: "nav.profile", icon: UserRound }
];
