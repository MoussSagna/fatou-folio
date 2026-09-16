import type { Project } from "../types/";

const API_URL = import.meta.env.VITE_API_URL;

export async function getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
        throw new Error("Unable to fetch projects");
    }
    const data = await response.json();
    return data as Project[];
}

export async function getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`);

    if (!response.ok) {
        throw new Error("Unable to fetch project");
    }

    return (await response.json()) as Project;
}

export async function getProjectBySlug(
    slug: string,
): Promise<Project> {
    const response = await fetch(
        `${API_URL}/projects/slug/${encodeURIComponent(slug)}`,
    );

    if (!response.ok) {
        throw new Error("Unable to fetch project");
    }

    return (await response.json()) as Project;
}