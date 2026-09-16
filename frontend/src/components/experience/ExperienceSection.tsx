import { useEffect, useState } from "react";
import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import {
    createExperience,
    deleteExperience,
    getExperiences,
    updateExperience,
    type ExperienceInput,
} from "../../services";
import { useProfile } from "../../hooks";
import type { Experience, Profile } from "../../types";

interface ExperienceSectionProps {
    profile?: Profile | null;
    isEditing?: boolean;
}

const emptyExperience: ExperienceInput = {
    period: "",
    company: "",
    role: "",
    location: "",
    description: "",
    order: 0,
};

function sortExperiences(experiences: Experience[]): Experience[] {
    return [...experiences].sort((a, b) => a.order - b.order);
}

function ExperienceFields({
    value,
    onChange,
}: {
    value: ExperienceInput;
    onChange: (value: ExperienceInput) => void;
}) {
    return (
        <div className="grid gap-3 md:grid-cols-2">
            <input aria-label="Période de l’expérience" value={value.period} onChange={(event) => onChange({ ...value, period: event.target.value })} placeholder="2024 — 2026" className="editor-input" />
            <input aria-label="Entreprise de l’expérience" value={value.company} onChange={(event) => onChange({ ...value, company: event.target.value })} placeholder="Nom de l’entreprise" className="editor-input" />
            <input aria-label="Poste de l’expérience" value={value.role} onChange={(event) => onChange({ ...value, role: event.target.value })} placeholder="Designer UX/UI" className="editor-input" />
            <input aria-label="Lieu de l’expérience" value={value.location ?? ""} onChange={(event) => onChange({ ...value, location: event.target.value })} placeholder="Paris, France" className="editor-input" />
            <textarea aria-label="Description de l’expérience" value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Description" className="editor-input min-h-20 md:col-span-2" />
            <input aria-label="Ordre de l’expérience" type="number" min="0" value={value.order} onChange={(event) => onChange({ ...value, order: Number(event.target.value) })} className="editor-input" />
        </div>
    );
}

export default function ExperienceSection({
    profile: profileProp,
    isEditing = false,
}: ExperienceSectionProps) {
    const { profile: hookProfile } = useProfile();
    const profile = profileProp ?? hookProfile;
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState<ExperienceInput>(emptyExperience);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingForm, setEditingForm] = useState<ExperienceInput>(emptyExperience);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadExperiences = async () => {
            try {
                setLoading(true);
                setExperiences(sortExperiences(await getExperiences()));
            } catch (requestError) {
                console.error(requestError);
                setError("Impossible de charger les expériences.");
            } finally {
                setLoading(false);
            }
        };

        void loadExperiences();
    }, []);

    const validate = (value: ExperienceInput): string | null => {
        if (!value.period.trim() || !value.company.trim() || !value.role.trim() || !value.description.trim()) {
            return "La période, l’entreprise, le poste et la description sont obligatoires.";
        }
        if (!Number.isInteger(value.order) || value.order < 0) {
            return "L’ordre doit être un entier positif ou nul.";
        }
        return null;
    };

    const handleCreate = async () => {
        const validationError = validate(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const created = await createExperience(form);
            setExperiences((current) => sortExperiences([...current, created]));
            setForm(emptyExperience);
            setFormOpen(false);
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible d’ajouter l’expérience.");
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (experience: Experience) => {
        setEditingId(experience.id);
        setEditingForm({
            period: experience.period,
            company: experience.company,
            role: experience.role,
            location: experience.location,
            description: experience.description,
            order: experience.order,
        });
    };

    const handleUpdate = async (id: number) => {
        const validationError = validate(editingForm);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const updated = await updateExperience(id, editingForm);
            setExperiences((current) =>
                sortExperiences(current.map((experience) => experience.id === id ? updated : experience)),
            );
            setEditingId(null);
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible d’enregistrer l’expérience.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (experience: Experience) => {
        if (!window.confirm(`Supprimer l’expérience « ${experience.role} » ?`)) {
            return;
        }

        try {
            setError(null);
            await deleteExperience(experience.id);
            setExperiences((current) => current.filter((item) => item.id !== experience.id));
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible de supprimer l’expérience.");
        }
    };

    return (
        <section className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-16 md:grid-cols-[1fr_3fr]">
                    <Reveal>
                        <div className="flex items-start gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                {profile?.experienceLabel || "Expérience"}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal delay={0.1}>
                            <div className="mb-16 flex items-end justify-between gap-8">
                                <h2 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl lg:text-8xl">
                                    {profile?.experienceHeading || "Mon parcours."}
                                </h2>
                                {!loading && experiences.length > 0 && (
                                    <span className="hidden pb-2 text-xs uppercase tracking-[0.2em] text-white/30 md:block">
                                        {experiences.length} expériences
                                    </span>
                                )}
                            </div>
                        </Reveal>

                        {isEditing && (
                            <div className="mb-8">
                                <button type="button" onClick={() => { setFormOpen((current) => !current); setError(null); }} className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/50">
                                    + Ajouter une expérience
                                </button>
                                {formOpen && (
                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <ExperienceFields value={form} onChange={setForm} />
                                        <div className="mt-4 flex gap-3">
                                            <button type="button" onClick={() => setFormOpen(false)} className="editor-secondary-button">Annuler</button>
                                            <button type="button" onClick={handleCreate} disabled={saving} className="editor-primary-button">{saving ? "Ajout..." : "Ajouter une expérience"}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {loading && <div className="border-t border-white/10 py-12 text-white/40">Chargement des expériences...</div>}

                        {!loading && experiences.length > 0 && (
                            <div className="border-t border-white/10">
                                {experiences.map((experience, index) => (
                                    <Reveal key={experience.id} delay={index * 0.05}>
                                        <motion.article whileHover={editingId === null ? "hover" : undefined} className="group relative border-b border-white/10 py-8 md:py-10">
                                            {isEditing && editingId === experience.id ? (
                                                <>
                                                    <ExperienceFields value={editingForm} onChange={setEditingForm} />
                                                    <div className="mt-4 flex gap-3">
                                                        <button type="button" onClick={() => setEditingId(null)} className="editor-secondary-button">Annuler</button>
                                                        <button type="button" onClick={() => handleUpdate(experience.id)} disabled={saving} className="editor-primary-button">{saving ? "Enregistrement..." : "Enregistrer l’expérience"}</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <motion.div variants={{ hover: { x: 10 } }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="grid gap-6 md:grid-cols-[180px_1fr_auto]">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.15em] text-white/30">{experience.period}</p>
                                                        {experience.location && <p className="mt-2 text-xs text-white/20">{experience.location}</p>}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-4xl">{experience.role}</h3>
                                                        <p className="mt-2 text-sm text-white/50 md:text-base">{experience.company}</p>
                                                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/30 md:text-base">{experience.description}</p>
                                                    </div>
                                                    {isEditing && (
                                                        <div className="flex gap-2 md:flex-col">
                                                            <button type="button" onClick={() => startEditing(experience)} className="editor-link-button">Modifier</button>
                                                            <button type="button" onClick={() => void handleDelete(experience)} className="editor-delete-button">Supprimer</button>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </motion.article>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {!loading && experiences.length === 0 && (
                            <div className="border-y border-white/10 py-12 text-sm uppercase tracking-[0.2em] text-white/30">
                                Aucune expérience ajoutée pour le moment.
                            </div>
                        )}

                        {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}
