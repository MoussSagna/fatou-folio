import type { Project, ProjectImage, ProjectSection } from "./project";

export interface AdminProjectImage extends Omit<ProjectImage, "id"> {
    id: string | number;
}

export interface AdminProjectSection extends Omit<ProjectSection, "id"> {
    id: string | number;
}

export interface AdminProject
    extends Omit<Project, "id" | "sections" | "images"> {
    id: string | number;
    sections: AdminProjectSection[];
    images: AdminProjectImage[];
}