import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SkillsSection from "./skills/SkillsSection";
import ExperienceSection from "./experience/ExperienceSection";
import {
    createExperience,
    createSkill,
    deleteExperience,
    deleteSkill,
    getExperiences,
    getProfile,
    getSkills,
    updateExperience,
    updateSkill,
} from "../services";

vi.mock("../services", () => ({
    createExperience: vi.fn(),
    createSkill: vi.fn(),
    deleteExperience: vi.fn(),
    deleteSkill: vi.fn(),
    getExperiences: vi.fn(),
    getProfile: vi.fn(),
    getSkills: vi.fn(),
    updateExperience: vi.fn(),
    updateSkill: vi.fn(),
}));

const profile = {
    id: 1,
    name: "Fatou",
    title: "Designer",
    bio: "Bio",
    skills: [],
};

const skill = {
    id: 1,
    number: "01",
    title: "UX Design",
    description: "Research and interface design",
    order: 1,
};

const experience = {
    id: 1,
    period: "2024 — 2026",
    company: "Studio",
    role: "Product Designer",
    location: "Paris",
    description: "Designed digital products.",
    order: 1,
};

describe("editable skills and experience sections", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getProfile).mockResolvedValue(profile);
        vi.mocked(getSkills).mockResolvedValue([skill]);
        vi.mocked(getExperiences).mockResolvedValue([experience]);
        vi.mocked(createSkill).mockResolvedValue({ ...skill, id: 2, title: "Visual Design" });
        vi.mocked(createExperience).mockResolvedValue({ ...experience, id: 2, role: "UX Researcher" });
        vi.mocked(updateSkill).mockResolvedValue({ ...skill, title: "Service Design" });
        vi.mocked(updateExperience).mockResolvedValue({ ...experience, role: "Lead Designer" });
        vi.mocked(deleteSkill).mockResolvedValue();
        vi.mocked(deleteExperience).mockResolvedValue();
        vi.stubGlobal("confirm", vi.fn(() => true));
    });

    it("adds a skill and updates the list without reloading", async () => {
        const user = userEvent.setup();
        render(<SkillsSection profile={profile} isEditing />);

        await user.click(await screen.findByRole("button", { name: /\+ add skill/i }));
        await user.type(screen.getByRole("textbox", { name: "Skill number" }), "02");
        await user.type(screen.getByRole("textbox", { name: "Skill title" }), "Visual Design");
        await user.type(screen.getByRole("textbox", { name: "Skill description" }), "Visual systems");
        await user.click(screen.getByRole("button", { name: "Add skill" }));

        await waitFor(() => {
            expect(createSkill).toHaveBeenCalledWith({
                number: "02",
                title: "Visual Design",
                description: "Visual systems",
                order: 0,
            });
        });
        expect(await screen.findByText("Visual Design")).toBeInTheDocument();
    });

    it("updates and deletes an existing skill", async () => {
        const user = userEvent.setup();
        render(<SkillsSection profile={profile} isEditing />);

        await user.click(await screen.findByRole("button", { name: "Edit" }));
        const title = screen.getByRole("textbox", { name: "Skill title" });
        await user.clear(title);
        await user.type(title, "Service Design");
        await user.click(screen.getByRole("button", { name: "Save skill" }));
        await waitFor(() => expect(updateSkill).toHaveBeenCalled());

        await user.click(screen.getByRole("button", { name: "Delete" }));
        await waitFor(() => expect(deleteSkill).toHaveBeenCalledWith(1));
    });

    it("adds, edits and deletes an experience", async () => {
        const user = userEvent.setup();
        render(<ExperienceSection profile={profile} isEditing />);

        await user.click(await screen.findByRole("button", { name: /\+ add experience/i }));
        await user.type(screen.getByRole("textbox", { name: "Experience period" }), "2026 — 2028");
        await user.type(screen.getByRole("textbox", { name: "Experience company" }), "New Studio");
        await user.type(screen.getByRole("textbox", { name: "Experience role" }), "UX Researcher");
        await user.type(screen.getByRole("textbox", { name: "Experience description" }), "Research and testing");
        await user.click(screen.getByRole("button", { name: "Add experience" }));
        await waitFor(() => expect(createExperience).toHaveBeenCalled());

        await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
        const role = screen.getByRole("textbox", { name: "Experience role" });
        await user.clear(role);
        await user.type(role, "Lead Designer");
        await user.click(screen.getByRole("button", { name: "Save experience" }));
        await waitFor(() => expect(updateExperience).toHaveBeenCalled());

        await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);
        await waitFor(() => expect(deleteExperience).toHaveBeenCalledWith(1));
    });
});
