export type Status = "online" | "donotdisturb" | "inactive" | "offline"
import { IconType } from "react-icons";
import { BsDiscord } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { FaGithubSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";

export type SocialMediaKey = "discord" | "linkedin" | "github" | "x" | "website"

export type SocialMediaConfig = {
    key: SocialMediaKey;
    label: string;
    icon: IconType;
};

export type SocialMediaValues = {
    discord: string;
    linkedin: string;
    github: string;
    x: string;
    website: string;
};

export const socialMedias: SocialMediaConfig[] = [
    { key: "discord", label: "Discord", icon: BsDiscord },
    { key: "linkedin", label: "LinkedIn", icon: RxLinkedinLogo },
    { key: "github", label: "GitHub", icon: FaGithubSquare },
    { key: "x", label: "X", icon: FaXTwitter },
    { key: "website", label: "Personal website", icon: CgWebsite },
];

export type transactions = "flag" | "geoint" | "daily" | "admin" | "penalty" | "shop"

export type Difficulty = "Easy" | "intermediate" | "Advance" | "Expert"
export type category = "Web" | "Crypto" | "Pwn" | "Reverse" | "Forensic" | "OSINT" | "Misc"

export const difficultyReward = {
    Easy: 10,
    Intermediate: 20,
    Advance: 35,
    Expert: 50,
} as const;

export const categoryReward = {
    Web: 0,
    Crypto: 2,
    Pwn: 4,
    Reverse: 3,
    Forensic: 3,
    OSINT: 2,
    Misc: 1
} as const;

export const flagDifficultyMultiplier = {
    Easy: 1,
    Intermediate: 1.2,
    Advance: 1.5,
    Expert: 2
} as const;

export const hintDifficultyMultiplier = {
    Easy: 0.08,
    Intermediate: 0.12,
    Advance: 0.18,
    Expert: 0.25
} as const;

export interface Option<T = string> {
    label: string;
    value: T;
    color?: string;
};

export const statusBtn: Option<Status>[] = [
    { label: "Online", value: "online" as Status, color: "text-green-400" },
    { label: "Do Not Disturb", value: "donotdisturb" as Status, color: "text-red-400" },
    { label: "Inactive", value: "inactive" as Status, color: "text-yellow-600" },
    { label: "Offline", value: "offline" as Status, color: "text-gray-400" },
];

export const difficultyBtn: Option<Difficulty>[] = [
    { label: "Easy", value: "Easy", color: "text-green-400" },
    { label: "Intermediate", value: "intermediate", color: "text-yellow-400" },
    { label: "Advanced", value: "Advance", color: "text-yellow-600" },
    { label: "Expert", value: "Expert", color: "text-red-400" },
];

export const categoryBtn: Option[] = [
    { label: "Web", value: "Web", color: "text-green-400" },
    { label: "Crypto", value: "Crypto", color: "text-yellow-400" },
    { label: "Pwn", value: "Pwn", color: "text-yellow-600" },
    { label: "Reverse", value: "Reverse", color: "text-red-400" },
    { label: "Forensic", value: "Forensic", color: "text-grey-400" },
    { label: "OSINT", value: "OSINT", color: "text-blue-400" },
    { label: "Misc", value: "Misc", color: "text-indigo-400" },
]

export type User = {
    user_id: number;
    username: string;
    bio: string;
    password: string;
    mail: string;
    role: Roles[];
    created_at: string;
    coins: number;
    points: number;
    pp_url: string;
    status: Status;
    is_online: boolean;
    is_anonymous: boolean;
    reset_password: boolean;
    banner: string;
    social_media: SocialMediaValues;
}

export type Room = {
    id: number;
    name: string;
    description: string;
    administrators: User[];
    max_person: number;
    created_at: string;
    created_by: number;
}

export type RoomRelation = {
    room_relation_id: number;
    user_id: number;
    can_access: boolean;
}

export type ActiveRoom = Room & RoomRelation;
export type InactiveRoom = Room & RoomRelation;
export type UserSessions = {
    session_id: string;
    user_id: number;
    connected_at: string;
    is_active: boolean;
}

export type UserSanctions = {
    id: number;
    type: string;
    reason: string;
    duration: number;
    created_at: string;
    user_id: number;
    staff_id: number;
    show_notif: boolean;
    permanent: boolean;
    expires_at: string;
    is_active: boolean;
}

export type UserTransactions = {
    id: number;
    user_id: number;
    amount: string;
    type: string;
    reference_id: number;
    created_at: string;
    staff_id: number;
    reason: string;
}

export type UserRoles = {
    id: number;
    user_id: number;
    role_id: number;
}

export type Flags = {
    id: number;
    flag: string;
    is_find: boolean;
    flag_found_date: string;
    challenge_id: number;
}

export type UserProgression = {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    category: string[];
    flag_format: string;
    files: string[];
    status: string;
    creator_id: number;
    created_at: string;
    coins: number;
    points: number;
    type: string;
    images: string;
    flags: Flags[];
}

export type Roles = {
    id: number;
    label: string;
    description: string;
    color: string;
}

export type Permissions = {
    id: number;
    name: string;
    description: string;
}

export type geoint = {
    id: number;
    title: string;
    description: string;
    difficulty: Difficulty | "";
    flag_format: string;
    images: string[];
    status: string;
    creator_id: number;
    created_at: string;
    coins?: number;
    points?: number;
}

export type ctf = {
    id: number;
    title: string;
    description: string;
    difficulty: Difficulty;
    category: category[];
    flag_format: string;
    files: string[];
    status: string;
    creators: [];
    created_at: string;
    coins?: number;
    points?: number;
}

export interface flags {
    id: number;
    challenge_id: number;
    title: string;
    flag: string;
    flag_format: string;
    description: string;
    hint: string;
    hint_cost?: number;
    challenge_type: string;
    difficulty: string;
    coins: number;
    points: number;
    hint_show: boolean;
    found: boolean;
}

// Geoint Builder ↓

export type GeointBuilderState = {
    title: string;
    description: string;
    difficulty: Option | null;
    flag_format: string;
    images: string[];
};

// CTF Builder ↓

export type CtfBuilderState = {
    title: string;
    description: string;
    difficulty: Option | null;
    category: Option[];
    flag_format: string;
    files: File[];
};

export type NewCtfFlag = {
    title: string;
    description: string;
    difficulty: Option | null;
    flag: string;
    flag_format: string;
    hint: string;
};