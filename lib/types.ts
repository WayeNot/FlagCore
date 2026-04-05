export type User = {
    user_id: number
    username: string
    email: string
    password: string
    role: string
    created_at: string
}

export type PatchNote = {
    id: number
    feature: string
    created_at: string
}

export type Features = {
    id: number
    feature: string
}

export type Suggest = {
    id: number
    user_id: number
    suggest: string
    username: string
    created_at: string
}