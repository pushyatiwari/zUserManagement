import type { UserRole } from "../types/user";

export type Tab = "All" | UserRole;

export const TABS: Tab[] = ["All", "Admin", "Manager"];
