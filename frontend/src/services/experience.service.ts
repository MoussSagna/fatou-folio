import type { Experience } from "../types/";

const API_URL = "http://localhost:3000/api";

export interface ExperienceInput {
    period: string;
    company: string;
    role: string;
    location?: string | null;
    description: string;
    order: number;
}

export async function getExperiences(): Promise<Experience[]> {
    const response = await fetch(`${API_URL}/experiences`);

    if (!response.ok) {
        throw new Error("Unable to fetch experiences");
    }

    return (await response.json()) as Experience[];
}

export async function createExperience(
    experience: ExperienceInput,
): Promise<Experience> {
    const response = await fetch(`${API_URL}/experiences`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experience),
    });

    if (!response.ok) {
        throw new Error("Unable to create experience");
    }

    return (await response.json()) as Experience;
}

export async function updateExperience(
    id: number,
    experience: ExperienceInput,
): Promise<Experience> {
    const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experience),
    });

    if (!response.ok) {
        throw new Error("Unable to update experience");
    }

    return (await response.json()) as Experience;
}

export async function deleteExperience(
    id: number,
): Promise<void> {
    const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to delete experience");
    }
}