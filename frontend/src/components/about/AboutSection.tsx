import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import { useProfile } from "../../hooks";
import type { Profile } from "../../types";

interface AboutSectionProps {
    profile?: Profile | null;
    loading?: boolean;
    isEditing?: boolean;
    onFieldChange?: <K extends keyof Profile>(
        field: K,
        value: Profile[K],
    ) => void;
}

function EditableField({
    value,
    onChange,
    isEditing,
    label,
    placeholder,
}: {
    value: string | null | undefined;
    onChange: (value: string) => void;
    isEditing: boolean;
    label: string;
    placeholder: string;
}) {
    if (!isEditing) {
        return <>{value || placeholder}</>;
    }

    return (
        <input
            aria-label={label}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
    );
}

export default function AboutSection({
    profile: profileProp,
    loading: loadingProp,
    isEditing = false,
    onFieldChange,
}: AboutSectionProps) {
    const { profile: hookProfile, loading: hookLoading } = useProfile();

    const profile = profileProp ?? hookProfile;
    const loading = loadingProp ?? hookLoading;

    return (
        <section
            id="about"
            className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48"
        >
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-16 md:grid-cols-[1fr_3fr]">
                    <Reveal>
                        <div className="flex items-start gap-3">
                            <span
                                className="mt-1 h-2 w-2 rounded-full"
                                style={{ backgroundColor: "var(--color-primary)" }}
                            />

                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                {loading
                                    ? "À propos"
                                    : profile?.aboutLabel || "À propos"}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal delay={0.1}>
                            <h2 className="max-w-6xl text-4xl font-medium leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-8xl">
                                {loading ? "Chargement..." : profile?.title || "UI/UX Designer"}
                            </h2>
                        </Reveal>

                        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
                            <Reveal delay={0.2}>
                                <p className="text-lg leading-relaxed text-white/50 md:text-xl">
                                    {loading ? "Chargement..." : profile?.bio || ""}
                                </p>
                            </Reveal>

                            <Reveal delay={0.3}>
                                {isEditing && onFieldChange ? (
                                    <textarea
                                        aria-label="Texte secondaire de la section À propos"
                                        value={profile?.aboutSecondaryText ?? ""}
                                        onChange={(event) =>
                                            onFieldChange(
                                                "aboutSecondaryText",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Je conçois des expériences numériques simples, intuitives et agréables à utiliser."
                                        className="editor-input min-h-32 text-lg md:text-xl"
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed text-white/50 md:text-xl">
                                        {profile?.aboutSecondaryText ||
                                            "Je conçois des expériences numériques simples, intuitives et agréables à utiliser."}
                                    </p>
                                )}
                            </Reveal>
                        </div>

                        <Reveal delay={0.4}>
                            <motion.div
                                whileHover={{ x: 8 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                }}
                                className="mt-16 inline-flex items-center gap-4 border-b border-white/20 pb-3"
                            >
                                <span className="text-sm uppercase tracking-[0.2em] text-white/60">
                                    {profile?.aboutCtaText || "En savoir plus sur moi"}
                                </span>

                                <span className="text-lg">↗</span>
                            </motion.div>
                        </Reveal>

                        {isEditing && onFieldChange && (
                            <div className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 md:grid-cols-3">
                                <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    Label
                                    <EditableField
                                        label="Libellé de la section À propos"
                                        value={profile?.aboutLabel}
                                        onChange={(value) => onFieldChange("aboutLabel", value)}
                                        isEditing={isEditing}
                                        placeholder="À propos"
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    Texte secondaire
                                    <EditableField
                                        label="Texte secondaire de la section À propos"
                                        value={profile?.aboutSecondaryText}
                                        onChange={(value) =>
                                            onFieldChange("aboutSecondaryText", value)
                                        }
                                        isEditing={isEditing}
                                        placeholder="Je conçois des expériences numériques simples, intuitives et agréables à utiliser."
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    CTA
                                    <EditableField
                                        label="Bouton de la section À propos"
                                        value={profile?.aboutCtaText}
                                        onChange={(value) =>
                                            onFieldChange("aboutCtaText", value)
                                        }
                                        isEditing={isEditing}
                                        placeholder="En savoir plus sur moi"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
