export interface Skill {
    id: number;
    number: string;
    title: string;
    description: string;
    order: number;
}

export interface Profile {
    id: number;
    name: string;
    title: string;
    bio: string;
    profileImage?: string | null;
    profileImagePublicId?: string | null;
    location?: string | null;
    contactEmail?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    behance?: string | null;
    dribbble?: string | null;
    cvUrl?: string | null;

    heroAvailabilityText?: string | null;
    heroCtaText?: string | null;
    aboutLabel?: string | null;
    aboutSecondaryText?: string | null;
    aboutCtaText?: string | null;
    skillsLabel?: string | null;
    skillsHeading?: string | null;
    experienceLabel?: string | null;
    experienceHeading?: string | null;
    contactLabel?: string | null;
    contactHeading?: string | null;
    contactAvailabilityText?: string | null;
    contactCtaText?: string | null;
    footerAvailabilityText?: string | null;

    skills: Skill[];
}