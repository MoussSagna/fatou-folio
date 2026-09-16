export interface ProjectImage {
  id: number;
  url: string;
  publicId?: string | null;
  alt: string;
  order: number;
}

export interface ProjectSection {
  id: number;
  number: string;
  title: string;
  content: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;

  client?: string;
  role?: string;
  year?: number;
  category: string;

  coverImage: string;
  coverPublicId?: string | null;

  tools: string[];
  deliverables: string[];

  sections: ProjectSection[];

  challenge?: string;
  research?: string;
  solution?: string;
  result?: string;

  published: boolean;
  featured: boolean;
  order: number;

  images: ProjectImage[];
}