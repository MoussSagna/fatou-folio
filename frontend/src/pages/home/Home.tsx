import { useEffect, useState, type ElementType } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import {
    AboutSection,
    ContactSection,
    ExperienceSection,
    Footer,
    Navbar,
    Reveal,
    SelectedWork,
    SkillsSection,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../services";
import type { Profile } from "../../types/";

interface EditableTextProps {
    label: string;
    value: string | null | undefined;
    onChange: (value: string) => void;
    isEditing: boolean;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
    as?: ElementType;
}

function EditableText({
    label,
    value,
    onChange,
    isEditing,
    placeholder = "",
    multiline = false,
    className = "",
    as: Component = "span",
}: EditableTextProps) {
    const resolvedValue = value?.trim() ? value : placeholder;

    if (!isEditing) {
        return <Component className={className}>{resolvedValue}</Component>;
    }

    const sharedClassName =
        "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";

    if (multiline) {
        return (
            <textarea
                aria-label={label}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={`${sharedClassName} min-h-[120px] ${className}`}
            />
        );
    }

    return (
        <input
            aria-label={label}
            type="text"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`${sharedClassName} ${className}`}
        />
    );
}

export default function Home() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await getProfile();

                setProfile(data);
            } catch (requestError) {
                console.error(requestError);
                setError("Impossible de charger le profil.");
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    const updateField = <K extends keyof Profile>(
        field: K,
        value: Profile[K],
    ) => {
        setProfile((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                [field]: value,
            };
        });
    };

    const handleSave = async () => {
        if (!profile) {
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const updatedProfile = await updateProfile(profile);

            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible d'enregistrer les modifications.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="overflow-hidden bg-[#111111] text-white">
            <Navbar
            />

            {user && !isEditing && (
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="fixed bottom-6 right-6 z-40 rounded-full border border-white/15 bg-[#161616]/95 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 shadow-2xl backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                    Modifier le site
                </button>
            )}

            {isEditing && (
                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-6 right-6 z-40 w-[320px] rounded-2xl border border-white/10 bg-[#161616]/95 p-4 shadow-2xl backdrop-blur-md"
                    aria-label="Éditeur du site"
                >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                        Mode édition
                    </p>

                    <p className="mt-2 text-sm text-white/80">
                        Modifiez le contenu visible sur la page publique.
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 rounded-full bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Sauvegarde..." : "Enregistrer"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 transition hover:border-white/30"
                        >
                            Fermer
                        </button>
                    </div>

                    {error && (
                        <p className="mt-3 text-xs text-red-300">{error}</p>
                    )}
                </motion.aside>
            )}

            <section className="relative flex min-h-screen items-end px-6 pb-12 pt-32 md:px-12 md:pb-16">
                <div className="mx-auto w-full max-w-[1600px]">
                    <div className="relative">
                        <Reveal>
                            <div className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: "var(--color-primary)" }}
                                />

                                <EditableText
                                    label="Titre professionnel"
                                    value={profile?.title}
                                    isEditing={Boolean(user) && isEditing}
                                    onChange={(value) => updateField("title", value)}
                                    placeholder="UI/UX Designer · Product Designer"
                                    className="text-inherit"
                                    as="span"
                                />
                            </div>
                        </Reveal>

                        <div className="relative">
                            <Reveal delay={0.1}>
                                <EditableText
                                    label="Nom"
                                    value={profile?.name}
                                    isEditing={Boolean(user) && isEditing}
                                    onChange={(value) => updateField("name", value)}
                                    placeholder="Fatou"
                                    className="block text-[18vw] font-medium uppercase leading-[0.72] tracking-[-0.09em] md:text-[15vw]"
                                    as="h1"
                                />
                            </Reveal>

                            <Reveal delay={0.2}>
                                <EditableText
                                    label="Titre"
                                    value={profile?.title}
                                    isEditing={Boolean(user) && isEditing}
                                    onChange={(value) => updateField("title", value)}
                                    placeholder="Designer"
                                    className="relative z-10 ml-[7vw] block text-[18vw] font-medium uppercase leading-[0.72] tracking-[-0.09em] md:text-[15vw]"
                                    as="h1"
                                />
                            </Reveal>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.7,
                                    rotate: -10,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 4,
                                }}
                                transition={{
                                    delay: 0.8,
                                    duration: 0.9,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{
                                    rotate: -3,
                                    scale: 1.05,
                                }}
                                className="absolute right-[4%] top-1/2 z-20 hidden h-36 w-28 -translate-y-1/2 overflow-hidden rounded-full border border-white/10 md:block lg:h-52 lg:w-40"
                            >
                                {profile?.profileImage && (
                                    <img
                                        src={profile.profileImage}
                                        alt={profile.name || "Designer"}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </motion.div>
                        </div>

                        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-end">
                            <Reveal delay={0.3}>
                                <div className="max-w-md">
                                    <EditableText
                                        label="Bio"
                                        value={profile?.bio}
                                        isEditing={Boolean(user) && isEditing}
                                        onChange={(value) => updateField("bio", value)}
                                        placeholder="Je conçois des expériences numériques qui allient clarté, émotion et interactions significatives."
                                        className="block text-base leading-relaxed text-white/50 md:text-lg"
                                        as="p"
                                        multiline
                                    />

                                    <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30">
                                        {profile?.location && (
                                            <>
                                                <EditableText
                                                    label="Localisation"
                                                    value={profile.location}
                                                    isEditing={Boolean(user) && isEditing}
                                                    onChange={(value) =>
                                                        updateField("location", value)
                                                    }
                                                    placeholder="Paris"
                                                    className="text-inherit"
                                                    as="span"
                                                />
                                                <span>·</span>
                                            </>
                                        )}

                                        <EditableText
                                            label="Disponibilité"
                                            value={profile?.heroAvailabilityText}
                                            isEditing={Boolean(user) && isEditing}
                                            onChange={(value) =>
                                                updateField("heroAvailabilityText", value)
                                            }
                                            placeholder="Disponible pour des projets"
                                            className="text-inherit"
                                            as="span"
                                        />
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="flex justify-start md:justify-end">
                                    <Link
                                        to="/projects"
                                        className="group flex items-center gap-5"
                                    >
                                        <motion.span
                                            whileHover={{
                                                scale: 1.08,
                                            }}
                                            whileTap={{
                                                scale: 0.95,
                                            }}
                                            className="flex h-16 w-16 items-center justify-center rounded-full border text-xl transition-colors duration-300 group-hover:border-white"
                                            style={{
                                                borderColor: "var(--color-primary)",
                                                backgroundColor: "var(--color-primary)",
                                                color: "var(--color-button-text)",
                                            }}
                                        >
                                            ↗
                                        </motion.span>

                                        <EditableText
                                            label="Bouton d'action principal"
                                            value={profile?.heroCtaText}
                                            isEditing={Boolean(user) && isEditing}
                                            onChange={(value) =>
                                                updateField("heroCtaText", value)
                                            }
                                            placeholder="Voir mes projets"
                                            className="text-sm uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 group-hover:text-white"
                                            as="span"
                                        />
                                    </Link>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 1.2,
                        duration: 0.8,
                    }}
                    className="absolute bottom-8 right-6 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30 md:right-12 md:flex"
                >
                    <span>Faites défiler pour découvrir</span>
                    <span className="text-base text-white/40">↓</span>
                </motion.div>
            </section>

            <AboutSection
                profile={profile}
                loading={loading}
                isEditing={isEditing}
                onFieldChange={updateField}
            />
            <SelectedWork />
            <SkillsSection
                profile={profile}
                isEditing={Boolean(user) && isEditing}
            />
            <ExperienceSection
                profile={profile}
                isEditing={Boolean(user) && isEditing}
            />
            <ContactSection
                profile={profile}
                loading={loading}
                isEditing={isEditing}
                onFieldChange={updateField}
            />
            <Footer profile={profile} loading={loading} />
        </main>
    );
}
