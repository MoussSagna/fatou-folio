import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../context/AuthContext";
import { ThemeProvider } from "../../context/ThemeContext";
import {
    getExperiences,
    getProfile,
    getSkills,
    updateProfile,
} from "../../services";
import Home from "./Home";

vi.mock("../../services", () => ({
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    getSkills: vi.fn(),
    getExperiences: vi.fn(),
}));

vi.mock("../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockGetProfile = vi.mocked(getProfile);
const mockGetSkills = vi.mocked(getSkills);
const mockGetExperiences = vi.mocked(getExperiences);
const mockUpdateProfile = vi.mocked(updateProfile);

const profileFixture = {
    id: 1,
    name: "Fatou",
    title: "UI/UX Designer",
    bio: "Je conçois des expériences numériques claires et élégantes.",
    profileImage: null,
    profileImagePublicId: null,
    location: "Paris",
    contactEmail: "bonjour@fatou.design",
    instagram: null,
    linkedin: null,
    behance: null,
    dribbble: null,
    cvUrl: null,
    heroAvailabilityText: "Disponible pour des projets",
    heroCtaText: "Voir mes projets",
    aboutLabel: "À propos de moi",
    aboutSecondaryText:
        "Je conçois des expériences numériques pensées pour être simples, intuitives et agréables à utiliser.",
    aboutCtaText: "En savoir plus sur moi",
    skillsLabel: "Expertise",
    skillsHeading: "Ce que je fais.",
    experienceLabel: "Expérience",
    experienceHeading: "Mon parcours.",
    contactLabel: "Contact",
    contactHeading: "Créons\nquelque chose\nde grand.",
    contactAvailabilityText:
        "Disponible pour des projets freelance et des collaborations sélectionnées",
    contactCtaText: "Démarrer une conversation",
    footerAvailabilityText: "Disponible pour des collaborations",
    skills: [],
};

function renderHome() {
    return render(
        <ThemeProvider>
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        </ThemeProvider>,
    );
}

describe("Home visual editor", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
        });
        mockGetProfile.mockResolvedValue(profileFixture);
        mockGetSkills.mockResolvedValue([]);
        mockGetExperiences.mockResolvedValue([]);
    });

    it("does not expose the visual editor to anonymous visitors", async () => {
        renderHome();

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: /fatou/i, level: 1 }),
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByRole("button", { name: /activer le mode édition/i }),
        ).not.toBeInTheDocument();
    });

    it("lets an authenticated admin activate editing and save a field", async () => {
        const user = userEvent.setup();

        mockUseAuth.mockReturnValue({
            user: { id: 1, email: "admin@example.com" },
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
        });
        mockUpdateProfile.mockResolvedValue({
            ...profileFixture,
            title: "Product Designer",
        });

        renderHome();

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: /fatou/i, level: 1 }),
            ).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole("button", { name: /edit site/i }),
        );

        const titleInput = screen.getByRole("textbox", {
            name: /titre professionnel/i,
        });

        await user.clear(titleInput);
        await user.type(titleInput, "Product Designer");

        const saveButtons = screen.getAllByRole("button", {
            name: /enregistrer/i,
        });
        await user.click(saveButtons[0]);

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith(
                expect.objectContaining({ title: "Product Designer" }),
            );
        });
    });
});
