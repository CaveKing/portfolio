import type { ComponentType, SVGProps } from "react";
import { ROUTES } from "@/constants";
import { BriefcaseIcon, GridIcon, UserIcon } from "@/components/ui/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.dashboard, label: "แดชบอร์ด", icon: GridIcon },
  { href: ROUTES.portfolio, label: "พอร์ต", icon: BriefcaseIcon },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  ...NAV_ITEMS,
  { href: ROUTES.profile, label: "โปรไฟล์", icon: UserIcon },
];
