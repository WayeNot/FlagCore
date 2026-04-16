import { Role } from "./types";

export const staff_role = ["owner", "admin", "dev"];
export const maitenance_role : Role[] = ["owner", "admin", "dev", "contributor"];

export const public_routes = [
    "/accounts/login",
    "/accounts/register",
    "/dev/maintenance",
]