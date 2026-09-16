export interface Experience {
    id: number;
    period: string;
    company: string;
    role: string;
    location?: string | null;
    description: string;
    order: number;
}