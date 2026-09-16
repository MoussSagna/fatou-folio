import type { Skill } from "../types/";

const API_URL = import.meta.env.VITE_API_URL;

export interface SkillInput {
    number: string;
    title: string;
    description: string;
    order: number;
}

export async function getSkills(): Promise<Skill[]> {
    const response = await fetch(`${API_URL}/skills`);

    if (!response.ok) {
        throw new Error("Impossible de récupérer les compétences.");
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
        throw new Error("Impossible de créer la compétence.");
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
        throw new Error("Impossible de mettre à jour la compétence.");
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
        throw new Error("Impossible de supprimer la compétence.");
    }
}
