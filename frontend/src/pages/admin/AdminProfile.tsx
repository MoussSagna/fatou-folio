import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    createExperience,
    createSkill,
    deleteExperience,
    deleteImage,
    deleteSkill,
    getExperiences,
    getProfile,
    getSkills,
    updateExperience,
    updateProfile,
    updateSkill,
    uploadImage,
} from "../../services";
import type { Experience, Profile, Skill } from "../../types";
import { useAuth } from "../../context/AuthContext";
const emptyProfile: Profile = {
    id: 1,
    name: "",
    title: "",
    bio: "",
    profileImage: null,
    profileImagePublicId: null,
    location: null,
    contactEmail: null,
    instagram: null,
    linkedin: null,
    behance: null,
    dribbble: null,
    cvUrl: null,
    heroAvailabilityText: null,
    heroCtaText: null,
    aboutLabel: null,
    aboutSecondaryText: null,
    aboutCtaText: null,
    skillsLabel: null,
    skillsHeading: null,
    experienceLabel: null,
    experienceHeading: null,
    contactLabel: null,
    contactHeading: null,
    contactAvailabilityText: null,
    contactCtaText: null,
    footerAvailabilityText: null,
    skills: [],
};
const emptySkill = {
    number: "",
    title: "",
    description: "",
    order: 0,
};

const emptyExperience = {
    period: "",
    company: "",
    role: "",
    location: "",
    description: "",
    order: 0,
};

export default function AdminProfile() {
    const { logout } = useAuth();

    const [profile, setProfile] = useState<Profile>(emptyProfile);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);

    const [skillForm, setSkillForm] = useState(emptySkill);
    const [experienceForm, setExperienceForm] =
        useState(emptyExperience);

    const [editingSkillId, setEditingSkillId] =
        useState<number | null>(null);

    const [editingExperienceId, setEditingExperienceId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingSkill, setSavingSkill] = useState(false);
    const [savingExperience, setSavingExperience] =
        useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    profileData,
                    skillsData,
                    experiencesData,
                ] = await Promise.all([
                    getProfile(),
                    getSkills(),
                    getExperiences(),
                ]);

                setProfile(profileData);
                setSkills(skillsData);
                setExperiences(experiencesData);
            } catch (error) {
                console.error(error);
                setError(
                    "Impossible de charger les données du profil.",
                );
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    const handleProfileChange = (
        field: keyof Profile,
        value: string,
    ) => {
        setProfile((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleProfileSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setSavingProfile(true);
            setMessage(null);
            setError(null);

            const updatedProfile = await updateProfile(profile);

            setProfile(updatedProfile);
            setMessage("Profil enregistré.");
        } catch (error) {
            console.error(error);
            setError("Impossible d'enregistrer le profil.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploadingImage(true);
            setMessage(null);
            setError(null);

            const result = await uploadImage(file);

            setProfile((current) => ({
                ...current,
                profileImage: result.url,
                profileImagePublicId: result.publicId,
            }));

            setMessage("Photo de profil téléchargée.");
        } catch (error) {
            console.error(error);
            setError("Impossible de télécharger l'image.");
        } finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    };

    const handleDeleteImage = async () => {
        if (!profile.profileImagePublicId) {
            setProfile((current) => ({
                ...current,
                profileImage: null,
                profileImagePublicId: null,
            }));

            return;
        }

        try {
            setError(null);
            setMessage(null);

            await deleteImage(profile.profileImagePublicId);

            setProfile((current) => ({
                ...current,
                profileImage: null,
                profileImagePublicId: null,
            }));

            setMessage("Photo supprimée.");
        } catch (error) {
            console.error(error);
            setError("Impossible de supprimer la photo.");
        }
    };

    const handleSkillSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setSavingSkill(true);
            setMessage(null);
            setError(null);

            if (editingSkillId) {
                const updatedSkill = await updateSkill(
                    editingSkillId,
                    skillForm,
                );

                setSkills((current) =>
                    current
                        .map((skill) =>
                            skill.id === editingSkillId
                                ? updatedSkill
                                : skill,
                        )
                        .sort((a, b) => a.order - b.order),
                );

                setMessage("Compétence modifiée.");
            } else {
                const createdSkill =
                    await createSkill(skillForm);

                setSkills((current) =>
                    [...current, createdSkill].sort(
                        (a, b) => a.order - b.order,
                    ),
                );

                setMessage("Compétence ajoutée.");
            }

            setSkillForm(emptySkill);
            setEditingSkillId(null);
        } catch (error) {
            console.error(error);
            setError("Impossible d'enregistrer la compétence.");
        } finally {
            setSavingSkill(false);
        }
    };

    const handleEditSkill = (skill: Skill) => {
        setEditingSkillId(skill.id);

        setSkillForm({
            number: skill.number,
            title: skill.title,
            description: skill.description,
            order: skill.order,
        });
    };

    const handleDeleteSkill = async (id: number) => {
        try {
            setError(null);
            setMessage(null);

            await deleteSkill(id);

            setSkills((current) =>
                current.filter((skill) => skill.id !== id),
            );

            if (editingSkillId === id) {
                setEditingSkillId(null);
                setSkillForm(emptySkill);
            }

            setMessage("Compétence supprimée.");
        } catch (error) {
            console.error(error);
            setError("Impossible de supprimer la compétence.");
        }
    };

    const handleExperienceSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setSavingExperience(true);
            setMessage(null);
            setError(null);

            const payload = {
                period: experienceForm.period,
                company: experienceForm.company,
                role: experienceForm.role,
                location:
                    experienceForm.location.trim() || null,
                description: experienceForm.description,
                order: experienceForm.order,
            };

            if (editingExperienceId) {
                const updatedExperience =
                    await updateExperience(
                        editingExperienceId,
                        payload,
                    );

                setExperiences((current) =>
                    current
                        .map((experience) =>
                            experience.id === editingExperienceId
                                ? updatedExperience
                                : experience,
                        )
                        .sort((a, b) => a.order - b.order),
                );

                setMessage("Expérience modifiée.");
            } else {
                const createdExperience =
                    await createExperience(payload);

                setExperiences((current) =>
                    [...current, createdExperience].sort(
                        (a, b) => a.order - b.order,
                    ),
                );

                setMessage("Expérience ajoutée.");
            }

            setExperienceForm(emptyExperience);
            setEditingExperienceId(null);
        } catch (error) {
            console.error(error);
            setError("Impossible d'enregistrer l'expérience.");
        } finally {
            setSavingExperience(false);
        }
    };

    const handleEditExperience = (
        experience: Experience,
    ) => {
        setEditingExperienceId(experience.id);

        setExperienceForm({
            period: experience.period,
            company: experience.company,
            role: experience.role,
            location: experience.location ?? "",
            description: experience.description,
            order: experience.order,
        });
    };

    const handleDeleteExperience = async (
        id: number,
    ) => {
        try {
            setError(null);
            setMessage(null);

            await deleteExperience(id);

            setExperiences((current) =>
                current.filter(
                    (experience) => experience.id !== id,
                ),
            );

            if (editingExperienceId === id) {
                setEditingExperienceId(null);
                setExperienceForm(emptyExperience);
            }

            setMessage("Expérience supprimée.");
        } catch (error) {
            console.error(error);
            setError("Impossible de supprimer l'expérience.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111111] px-6 py-24 text-white md:px-12">
                <div className="mx-auto max-w-6xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                        Chargement du profil...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#111111] px-6 py-12 text-white md:px-12 md:py-16">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 border-b border-white/10 pb-8">
                    <div className="mb-8">
                        <Link
                            to="/admin"
                            className="group inline-flex items-center gap-3 text-sm text-white/40 transition-colors duration-300 hover:text-white"
                        >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
            </span>

                            <span>Retour au dashboard</span>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30">
                                Administration
                            </p>

                            <h1 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                                Mon profil
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => void logout()}
                            className="w-fit rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/40 hover:text-white"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleProfileSubmit}
                    className="space-y-12"
                >
                    <section className="rounded-2xl border border-white/10 p-6 md:p-8">
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                Informations générales
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="space-y-2">
                <span className="text-sm text-white/50">
                  Nom
                </span>

                                <input
                                    value={profile.name}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-sm text-white/50">
                  Titre
                </span>

                                <input
                                    value={profile.title}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "title",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-white/50">
                  Biographie
                </span>

                                <textarea
                                    value={profile.bio}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "bio",
                                            event.target.value,
                                        )
                                    }
                                    rows={6}
                                    className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-sm text-white/50">
                  Localisation
                </span>

                                <input
                                    value={profile.location ?? ""}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "location",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-sm text-white/50">
                  Email
                </span>

                                <input
                                    type="email"
                                    value={profile.contactEmail ?? ""}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "contactEmail",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 p-6 md:p-8">
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                Réseaux sociaux
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {(
                                [
                                    ["instagram", "Instagram"],
                                    ["linkedin", "LinkedIn"],
                                    ["behance", "Behance"],
                                    ["dribbble", "Dribbble"],
                                    ["cvUrl", "CV"],
                                ] as const
                            ).map(([field, label]) => (
                                <label
                                    key={field}
                                    className="space-y-2"
                                >
                  <span className="text-sm text-white/50">
                    {label}
                  </span>

                                    <input
                                        value={profile[field] ?? ""}
                                        onChange={(event) =>
                                            handleProfileChange(
                                                field,
                                                event.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 p-6 md:p-8">
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                Photo de profil
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            {profile.profileImage && (
                                <img
                                    src={profile.profileImage}
                                    alt={profile.name}
                                    className="h-32 w-32 rounded-2xl object-cover"
                                />
                            )}

                            <div className="flex flex-wrap gap-3">
                                <label className="cursor-pointer rounded-full border border-white/15 px-5 py-3 text-sm transition hover:border-white/40">
                                    {uploadingImage
                                        ? "Téléchargement..."
                                        : "Choisir une image"}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploadingImage}
                                    />
                                </label>

                                {profile.profileImage && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void handleDeleteImage()
                                        }
                                        className="rounded-full border border-red-400/20 px-5 py-3 text-sm text-red-300 transition hover:border-red-400/40"
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 p-6 md:p-8">
                        <div className="mb-10">
                            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/30">
                                Contenu du portfolio
                            </p>

                            <h2 className="text-3xl font-medium tracking-[-0.04em]">
                                Textes des sections
                            </h2>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/30">
                                    Hero
                                </p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Disponibilité
          </span>

                                        <input
                                            value={profile.heroAvailabilityText ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "heroAvailabilityText",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Disponible pour des projets"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Texte du bouton
          </span>

                                        <input
                                            value={profile.heroCtaText ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "heroCtaText",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Voir mes projets"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-10">
                                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/30">
                                    À propos
                                </p>

                                <div className="space-y-6">
                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Label
          </span>

                                        <input
                                            value={profile.aboutLabel ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "aboutLabel",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="À propos de moi"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Texte secondaire
          </span>

                                        <textarea
                                            value={profile.aboutSecondaryText ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "aboutSecondaryText",
                                                    event.target.value,
                                                )
                                            }
                                            rows={4}
                                            placeholder="Je conçois des expériences numériques..."
                                            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Texte du lien
          </span>

                                        <input
                                            value={profile.aboutCtaText ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "aboutCtaText",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="En savoir plus sur moi"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-10">
                                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/30">
                                    Compétences
                                </p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Label
          </span>

                                        <input
                                            value={profile.skillsLabel ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "skillsLabel",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Expertise"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Titre
          </span>

                                        <input
                                            value={profile.skillsHeading ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "skillsHeading",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ce que je fais."
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-10">
                                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/30">
                                    Expérience
                                </p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Label
          </span>

                                        <input
                                            value={profile.experienceLabel ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "experienceLabel",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Expérience"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Titre
          </span>

                                        <input
                                            value={profile.experienceHeading ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "experienceHeading",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Mon parcours."
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-10">
                                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/30">
                                    Contact
                                </p>

                                <div className="space-y-6">
                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Label
          </span>

                                        <input
                                            value={profile.contactLabel ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "contactLabel",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Contact"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <label className="space-y-2">
          <span className="text-sm text-white/50">
            Titre
          </span>

                                        <textarea
                                            value={profile.contactHeading ?? ""}
                                            onChange={(event) =>
                                                handleProfileChange(
                                                    "contactHeading",
                                                    event.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder={"Let's make\nsomething\ngreat."}
                                            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                        />
                                    </label>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="space-y-2">
            <span className="text-sm text-white/50">
              Disponibilité
            </span>

                                            <input
                                                value={
                                                    profile.contactAvailabilityText ?? ""
                                                }
                                                onChange={(event) =>
                                                    handleProfileChange(
                                                        "contactAvailabilityText",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Disponible pour des missions freelance"
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                            />
                                        </label>

                                        <label className="space-y-2">
            <span className="text-sm text-white/50">
              Texte du bouton
            </span>

                                            <input
                                                value={profile.contactCtaText ?? ""}
                                                onChange={(event) =>
                                                    handleProfileChange(
                                                        "contactCtaText",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Démarrer une conversation"
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-10">
                                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/30">
                                    Footer
                                </p>

                                <label className="space-y-2">
        <span className="text-sm text-white/50">
          Disponibilité
        </span>

                                    <input
                                        value={profile.footerAvailabilityText ?? ""}
                                        onChange={(event) =>
                                            handleProfileChange(
                                                "footerAvailabilityText",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Disponible pour des collaborations"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                                    />
                                </label>
                            </div>
                        </div>
                    </section>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {savingProfile
                                ? "Enregistrement..."
                                : "Enregistrer le profil"}
                        </button>
                    </div>
                </form>

                <section className="mt-20 rounded-2xl border border-white/10 p-6 md:p-8">
                    <div className="mb-10 flex items-end justify-between gap-6">
                        <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/30">
                                Compétences
                            </p>

                            <h2 className="text-3xl font-medium tracking-[-0.04em]">
                                {editingSkillId
                                    ? "Modifier la compétence"
                                    : "Ajouter une compétence"}
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSkillSubmit}
                        className="grid gap-5 md:grid-cols-2"
                    >
                        <input
                            placeholder="Numéro"
                            value={skillForm.number}
                            onChange={(event) =>
                                setSkillForm((current) => ({
                                    ...current,
                                    number: event.target.value,
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <input
                            placeholder="Titre"
                            value={skillForm.title}
                            onChange={(event) =>
                                setSkillForm((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <textarea
                            placeholder="Description"
                            value={skillForm.description}
                            onChange={(event) =>
                                setSkillForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                            rows={4}
                            className="resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30 md:col-span-2"
                        />

                        <input
                            type="number"
                            placeholder="Ordre"
                            value={skillForm.order}
                            onChange={(event) =>
                                setSkillForm((current) => ({
                                    ...current,
                                    order: Number(event.target.value),
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={savingSkill}
                                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
                            >
                                {savingSkill
                                    ? "Enregistrement..."
                                    : editingSkillId
                                        ? "Modifier"
                                        : "Ajouter"}
                            </button>

                            {editingSkillId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingSkillId(null);
                                        setSkillForm(emptySkill);
                                    }}
                                    className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/60"
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-10 border-t border-white/10">
                        {skills
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex flex-col gap-5 border-b border-white/10 py-6 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="text-xs text-white/30">
                                            {skill.number}
                                        </p>

                                        <h3 className="mt-1 text-xl font-medium">
                                            {skill.title}
                                        </h3>

                                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
                                            {skill.description}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditSkill(skill)
                                            }
                                            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-white/40 hover:text-white"
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleDeleteSkill(skill.id)
                                            }
                                            className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-300 transition hover:border-red-400/40"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                <section className="mt-20 rounded-2xl border border-white/10 p-6 md:p-8">
                    <div className="mb-10">
                        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/30">
                            Expériences
                        </p>

                        <h2 className="text-3xl font-medium tracking-[-0.04em]">
                            {editingExperienceId
                                ? "Modifier l'expérience"
                                : "Ajouter une expérience"}
                        </h2>
                    </div>

                    <form
                        onSubmit={handleExperienceSubmit}
                        className="grid gap-5 md:grid-cols-2"
                    >
                        <input
                            placeholder="Période"
                            value={experienceForm.period}
                            onChange={(event) =>
                                setExperienceForm((current) => ({
                                    ...current,
                                    period: event.target.value,
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <input
                            placeholder="Entreprise"
                            value={experienceForm.company}
                            onChange={(event) =>
                                setExperienceForm((current) => ({
                                    ...current,
                                    company: event.target.value,
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <input
                            placeholder="Poste"
                            value={experienceForm.role}
                            onChange={(event) =>
                                setExperienceForm((current) => ({
                                    ...current,
                                    role: event.target.value,
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <input
                            placeholder="Lieu"
                            value={experienceForm.location}
                            onChange={(event) =>
                                setExperienceForm((current) => ({
                                    ...current,
                                    location: event.target.value,
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <textarea
                            placeholder="Description"
                            value={experienceForm.description}
                            onChange={(event) =>
                                setExperienceForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                            rows={5}
                            className="resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30 md:col-span-2"
                        />

                        <input
                            type="number"
                            placeholder="Ordre"
                            value={experienceForm.order}
                            onChange={(event) =>
                                setExperienceForm((current) => ({
                                    ...current,
                                    order: Number(event.target.value),
                                }))
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                        />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={savingExperience}
                                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
                            >
                                {savingExperience
                                    ? "Enregistrement..."
                                    : editingExperienceId
                                        ? "Modifier"
                                        : "Ajouter"}
                            </button>

                            {editingExperienceId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingExperienceId(null);
                                        setExperienceForm(
                                            emptyExperience,
                                        );
                                    }}
                                    className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/60"
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-10 border-t border-white/10">
                        {experiences
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((experience) => (
                                <div
                                    key={experience.id}
                                    className="flex flex-col gap-5 border-b border-white/10 py-6 md:flex-row md:items-start md:justify-between"
                                >
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                                            {experience.period}
                                        </p>

                                        <h3 className="mt-2 text-xl font-medium">
                                            {experience.role}
                                        </h3>

                                        <p className="mt-1 text-sm text-white/50">
                                            {experience.company}
                                            {experience.location
                                                ? ` · ${experience.location}`
                                                : ""}
                                        </p>

                                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/40">
                                            {experience.description}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditExperience(
                                                    experience,
                                                )
                                            }
                                            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-white/40 hover:text-white"
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleDeleteExperience(
                                                    experience.id,
                                                )
                                            }
                                            className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-300 transition hover:border-red-400/40"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}

                        {experiences.length === 0 && (
                            <p className="py-10 text-sm text-white/30">
                                Aucune expérience renseignée.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}