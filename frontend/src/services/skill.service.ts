import type { Skill } from "../types/";

const API_URL = "http://localhost:3000/api";

export interface SkillInput {
    number: string;
    title: string;
    description: string;
    order: number;
}

export async function getSkills(): Promise<Skill[]> {
    const response = await fetch(`${API_URL}/skills`);

    if (!response.ok) {
        throw new Error("Unable to fetch skills");
    }

    return (await response.json()) as Skill[];
}

export async function createSkill(
    skill: SkillInput,
): Promise<Skill> {
    const response = await fetch(`${API_URL}/skills`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(skill),
    });

    if (!response.ok) {
        throw new Error("Unable to create skill");
    }

    return (await response.json()) as Skill;
}

export async function updateSkill(
    id: number,
    skill: SkillInput,
): Promise<Skill> {
    const response = await fetch(`${API_URL}/skills/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(skill),
    });

    if (!response.ok) {
        throw new Error("Unable to update skill");
    }

    return (await response.json()) as Skill;
}

export async function deleteSkill(
    id: number,
): Promise<void> {
    const response = await fetch(`${API_URL}/skills/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to delete skill");
    }
}