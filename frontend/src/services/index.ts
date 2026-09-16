import { getProject, getProjects, getProjectBySlug} from "./projects.service.ts";
import {login,logout,getCurrentUser } from './auth.service.ts'
import { uploadImage, deleteImage } from './upload.service.ts'
import { updateProfile, getProfile} from './profile.service.ts'
export {
    createSkill,
    deleteSkill,
    getSkills,
    updateSkill,
} from "./skill.service";
export {
    createExperience,
    deleteExperience,
    getExperiences,
    updateExperience,
} from "./experience.service";
export type { ExperienceInput } from "./experience.service";

export type { SkillInput } from "./skill.service";
export { getProjects, getProject, getProjectBySlug, logout, login, getCurrentUser, uploadImage, deleteImage , updateProfile, getProfile};