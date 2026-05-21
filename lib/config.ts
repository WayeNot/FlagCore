import { socialMedias, Status, User } from "./types";

export const default_pp = "https://i.giphy.com/adwsEJi5lQRXrgJNWL.webp"

export const default_user: User = {
    user_id: -1,
    username: "Guest",
    bio: "Bio of a guest guy !",
    password: "",
    mail: "",
    role: [],
    created_at: "",
    coins: 0,
    points: 0,
    pp_url: "",
    status: "offline",
    is_online: false,
    is_anonymous: false,
    reset_password: false,
    banner: "",
    social_media: {
        discord: "",
        linkedin: "",
        github: "",
        website: "",
        x: ""
    },
}

export const owners = [
    { name: "Timéo", linkedin: "https://www.linkedin.com/in/tim%C3%A9o-baffreau-le-roux-511a1a353/" },
    { name: "Aymeric", linkedin: "https://www.linkedin.com/in/aymeric-beaune-9b81b0364/" },
];

export const Permissions = {
    contributor: {
        canCreate: {
            ctf: "contributor.canCreate.ctf",
            geoint: "contributor.canCreate.geoint",
            rooom: "contributor.canCreate.room"
        },
    },

    panelAdmin: {
        canOpen: "panelAdmin.canOpen",
        dashboard: "panelAdmin.dashboard",
        manageUser: "panelAdmin.manageUser",
        role: "panelAdmin.role",
        challenges: "panelAdmin.challenges",
        flags: "panelAdmin.flags",
        scoreboard: "panelAdmin.scoreboard",
        announcement: "panelAdmin.announcement",
        settings: "panelAdmin.settings",
        logs: "panelAdmin.logs",
        user: {
            informations: "panelAdmin.user.informations",
            dashboard: "panelAdmin.user.dashboard",
            session: "panelAdmin.user.session",
            sanctions: "panelAdmin.user.sanctions",
            coins: "panelAdmin.user.coins",
            role: "panelAdmin.user.role",
            progression: "panelAdmin.user.progression",
            monitoring: "panelAdmin.user.monitoring",
        }
    },

    room: {
        canCreateRoom: "room.canCreate",
        canModerateRoom: "room.canModerateRoom",
        canCreateChallenge: "room.challenge.canCreate",
    },

    advanced: {
        administrator: "advanced.administrator"
    },

    bypass: {
        maintenance: "bypass.maintenance",
    },
} as const

export const colorClasses = {
    red: "bg-red-500/40",
    orange: "bg-orange-500/40",
    amber: "bg-amber-500/40",
    yellow: "bg-yellow-300/40",
    lime: "bg-lime-500/40",
    green: "bg-green-500/40",
    emerald: "bg-emerald-500/40",
    teal: "bg-teal-500/40"
}

export const colorRole: (keyof typeof colorClasses)[] = [
    "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal"
]

export const maintenance_route = "/dev/maintenance"

export const public_routes = [
    "/",
    "/dev/maintenance",
    "/accounts/login",
    "/accounts/register",
]

export const noGuestRoute = [
    "/challenges/geoint"
];

export const statusColor: Record<Status, string> = {
    online: "border-green-500 border",
    donotdisturb: "border-red-500 border",
    inactive: "border-yellow-500 border",
    offline: "border-gray-500 border"
}

export const statusColorHover: Record<Status, string> = {
    online: "border-green-700",
    donotdisturb: "border-red-700",
    inactive: "border-yellow-700",
    offline: "border-gray-700"
}

export const coinManagement = ["100", "500", "1000", "-100", "-500", "-1000"]