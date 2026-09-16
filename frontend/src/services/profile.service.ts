import type { Profile } from "../types/";

const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile(): Promise<Profile> {
    const response = await fetch(`${API_URL}/profile`);

    if (!response.ok) {
        throw new Error("Unable to fetch profile");
    }

    return (await response.json()) as Profile;
}

export async function updateProfile(
    profile: Profile,
): Promise<Profile> {
    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: profile.name.trim(),
            title: profile.title.trim(),
            bio: profile.bio.trim(),
            profileImage: profile.profileImage?.trim() || null,
            profileImagePublicId:
                profile.profileImagePublicId?.trim() || null,
            location: profile.location?.trim() || null,
            contactEmail:
                profile.contactEmail?.trim() || null,
            instagram: profile.instagram?.trim() || null,
            linkedin: profile.linkedin?.trim() || null,
            behance: profile.behance?.trim() || null,
            dribbble: profile.dribbble?.trim() || null,
            cvUrl: profile.cvUrl?.trim() || null,

            heroAvailabilityText:
                profile.heroAvailabilityText?.trim() || null,
            heroCtaText:
                profile.heroCtaText?.trim() || null,

            aboutLabel:
                profile.aboutLabel?.trim() || null,
            aboutSecondaryText:
                profile.aboutSecondaryText?.trim() || null,
            aboutCtaText:
                profile.aboutCtaText?.trim() || null,

            skillsLabel:
                profile.skillsLabel?.trim() || null,
            skillsHeading:
                profile.skillsHeading?.trim() || null,

            experienceLabel:
                profile.experienceLabel?.trim() || null,
            experienceHeading:
                profile.experienceHeading?.trim() || null,

            contactLabel:
                profile.contactLabel?.trim() || null,
            contactHeading:
                profile.contactHeading?.trim() || null,
            contactAvailabilityText:
                profile.contactAvailabilityText?.trim() || null,
            contactCtaText:
                profile.contactCtaText?.trim() || null,

            footerAvailabilityText:
                profile.footerAvailabilityText?.trim() || null,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();

        console.error(
            "UPDATE PROFILE STATUS:",
            response.status,
        );

        console.error(
            "UPDATE PROFILE RESPONSE:",
            errorBody,
        );

        throw new Error(
            `Unable to update profile (${response.status})`,
        );
    }

    return (await response.json()) as Profile;
}