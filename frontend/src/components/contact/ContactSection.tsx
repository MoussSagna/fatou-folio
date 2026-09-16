import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import { useProfile } from "../../hooks";
import type { Profile } from "../../types";

interface ContactSectionProps {
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
    multiline = false,
}: {
    value: string | null | undefined;
    onChange: (value: string) => void;
    isEditing: boolean;
    label: string;
    placeholder: string;
    multiline?: boolean;
}) {
    if (!isEditing) {
        return <>{value || placeholder}</>;
    }

    if (multiline) {
        return (
            <textarea
                aria-label={label}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
            />
        );
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

export default function ContactSection({
    profile: profileProp,
    loading: loadingProp,
    isEditing = false,
    onFieldChange,
}: ContactSectionProps) {
    const { profile: hookProfile, loading: hookLoading } = useProfile();

    const profile = profileProp ?? hookProfile;
    const loading = loadingProp ?? hookLoading;
    const contactEmail = profile?.contactEmail;

    const contactHeading =
        profile?.contactHeading || "Créons\nquelque chose\nde formidable.";

    const contactHeadingLines = contactHeading.split("\n");

    return (
        <section
            id="contact"
            className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48"
        >
            <div className="mx-auto max-w-[1600px]">
                <Reveal>
                    <div className="flex items-start gap-3">
                        <span
                            className="mt-1 h-2 w-2 rounded-full"
                            style={{ backgroundColor: "var(--color-primary)" }}
                        />

                        <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                            {loading ? "Contact" : profile?.contactLabel || "Contact"}
                        </p>
                    </div>
                </Reveal>

                <div className="mt-16 grid gap-16 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <Reveal delay={0.1}>
                            <h2 className="max-w-6xl text-6xl font-medium leading-[0.82] tracking-[-0.07em] md:text-8xl lg:text-[10rem]">
                                {contactHeadingLines.map((line, index) => (
                                    <span key={`${line}-${index}`} className="block">
                                        {line}
                                    </span>
                                ))}
                            </h2>
                        </Reveal>
                    </div>

                    <Reveal delay={0.2}>
                        <motion.a
                            href={contactEmail ? `mailto:${contactEmail}` : undefined}
                            whileHover={{
                                scale: 1.08,
                                rotate: -4,
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 20,
                            }}
                            className="group flex h-36 w-36 shrink-0 items-center justify-center rounded-full text-center text-sm font-medium uppercase tracking-[0.1em] md:h-48 md:w-48"
                            style={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-button-text)",
                            }}
                        >
                            <span>
                                {profile?.contactCtaText || "Me contacter"}

                                <br />

                                <span className="text-lg">↗</span>
                            </span>
                        </motion.a>
                    </Reveal>
                </div>

                <Reveal delay={0.3}>
                    <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-6 md:mt-32 md:flex-row md:items-center md:justify-between">
                        {isEditing && onFieldChange ? (
                            <textarea
                                aria-label="Texte de disponibilité de la section Contact"
                                value={profile?.contactAvailabilityText ?? ""}
                                onChange={(event) =>
                                    onFieldChange(
                                        "contactAvailabilityText",
                                        event.target.value,
                                    )
                                }
                                placeholder="Disponible pour des projets en freelance et des collaborations sélectionnées"
                                className="editor-input min-h-16 text-sm md:max-w-xl"
                            />
                        ) : (
                            <p className="text-sm text-white/40">
                                {profile?.contactAvailabilityText ||
                                    "Disponible pour des projets en freelance et des collaborations sélectionnées"}
                            </p>
                        )}

                        {contactEmail && (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                            >
                                {contactEmail}
                            </a>
                        )}
                    </div>
                </Reveal>

                {isEditing && onFieldChange && (
                    <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 md:grid-cols-3">
                        <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Label
                            <EditableField
                                label="Libellé de la section Contact"
                                value={profile?.contactLabel}
                                onChange={(value) => onFieldChange("contactLabel", value)}
                                isEditing={isEditing}
                                placeholder="Contact"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Titre
                            <EditableField
                                label="Titre de la section Contact"
                                value={profile?.contactHeading}
                                onChange={(value) => onFieldChange("contactHeading", value)}
                                isEditing={isEditing}
                                placeholder="Créons\nquelque chose\nde formidable."
                                multiline
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                            CTA
                            <EditableField
                                label="Bouton de la section Contact"
                                value={profile?.contactCtaText}
                                onChange={(value) => onFieldChange("contactCtaText", value)}
                                isEditing={isEditing}
                                placeholder="Me contacter"
                            />
                        </label>
                    </div>
                )}
            </div>
        </section>
    );
}
