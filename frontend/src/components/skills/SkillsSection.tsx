import { useEffect, useState } from "react";
import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import {
    createSkill,
    deleteSkill,
    getSkills,
    updateSkill,
    type SkillInput,
} from "../../services";
import { useProfile } from "../../hooks";
import type { Profile, Skill } from "../../types";

interface SkillsSectionProps {
    profile?: Profile | null;
    isEditing?: boolean;
}

const emptySkill: SkillInput = {
    number: "",
    title: "",
    description: "",
    order: 0,
};

function sortSkills(skills: Skill[]): Skill[] {
    return [...skills].sort((a, b) => a.order - b.order);
}

function SkillFields({
    value,
    onChange,
}: {
    value: SkillInput;
    onChange: (value: SkillInput) => void;
}) {
    return (
        <div className="grid gap-3 md:grid-cols-[80px_1fr_1fr_80px]">
            <input
                aria-label="Numéro de compétence"
                value={value.number}
                onChange={(event) =>
                    onChange({ ...value, number: event.target.value })
                }
                placeholder="01"
                className="editor-input"
            />
            <input
                aria-label="Titre de la compétence"
                value={value.title}
                onChange={(event) =>
                    onChange({ ...value, title: event.target.value })
                }
                placeholder="UX Design"
                className="editor-input"
            />
            <textarea
                aria-label="Description de la compétence"
                value={value.description}
                onChange={(event) =>
                    onChange({ ...value, description: event.target.value })
                }
                placeholder="Description"
                className="editor-input min-h-10"
            />
            <input
                aria-label="Ordre de la compétence"
                type="number"
                min="0"
                value={value.order}
                onChange={(event) =>
                    onChange({
                        ...value,
                        order: Number(event.target.value),
                    })
                }
                className="editor-input"
            />
        </div>
    );
}

export default function SkillsSection({
    profile: profileProp,
    isEditing = false,
}: SkillsSectionProps) {
    const { profile: hookProfile } = useProfile();
    const profile = profileProp ?? hookProfile;
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState<SkillInput>(emptySkill);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingForm, setEditingForm] = useState<SkillInput>(emptySkill);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSkills = async () => {
            try {
                setLoading(true);
                setSkills(sortSkills(await getSkills()));
            } catch (requestError) {
                console.error(requestError);
                setError("Impossible de charger les compétences.");
            } finally {
                setLoading(false);
            }
        };

        void loadSkills();
    }, []);

    const validate = (value: SkillInput): string | null => {
        if (!value.number.trim() || !value.title.trim() || !value.description.trim()) {
            return "Le numéro, le titre et la description sont obligatoires.";
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
            const created = await createSkill(form);
            setSkills((current) => sortSkills([...current, created]));
            setForm(emptySkill);
            setFormOpen(false);
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible d’ajouter la compétence.");
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (skill: Skill) => {
        setEditingId(skill.id);
        setEditingForm({
            number: skill.number,
            title: skill.title,
            description: skill.description,
            order: skill.order,
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
            const updated = await updateSkill(id, editingForm);
            setSkills((current) =>
                sortSkills(current.map((skill) => (skill.id === id ? updated : skill))),
            );
            setEditingId(null);
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible d’enregistrer la compétence.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (skill: Skill) => {
        if (!window.confirm(`Supprimer la compétence « ${skill.title} » ?`)) {
            return;
        }

        try {
            setError(null);
            await deleteSkill(skill.id);
            setSkills((current) => current.filter((item) => item.id !== skill.id));
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible de supprimer la compétence.");
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
                                {profile?.skillsLabel || "Compétences"}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal delay={0.1}>
                            <div className="mb-16 flex items-end justify-between gap-8">
                                <h2 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl lg:text-8xl">
                                    {profile?.skillsHeading || "Ce que je fais."}
                                </h2>
                                {!loading && skills.length > 0 && (
                                    <span className="hidden pb-2 text-xs uppercase tracking-[0.2em] text-white/30 md:block">
                                        {skills.length} compétences
                                    </span>
                                )}
                            </div>
                        </Reveal>

                        {isEditing && (
                            <div className="mb-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormOpen((current) => !current);
                                        setError(null);
                                    }}
                                    className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/50"
                                >
                                    + Ajouter une compétence
                                </button>

                                {formOpen && (
                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <SkillFields value={form} onChange={setForm} />
                                        <div className="mt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormOpen(false)}
                                                className="editor-secondary-button"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCreate}
                                                disabled={saving}
                                                className="editor-primary-button"
                                            >
                                                {saving ? "Ajout..." : "Ajouter une compétence"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {loading && <div className="border-t border-white/10 py-12 text-white/40">Chargement des compétences...</div>}

                        {!loading && skills.length > 0 && (
                            <div className="border-t border-white/10">
                                {skills.map((skill, index) => (
                                    <Reveal key={skill.id} delay={index * 0.05}>
                                        <motion.article
                                            whileHover={editingId === null ? "hover" : undefined}
                                            className="group relative border-b border-white/10 py-7 md:py-9"
                                        >
                                            {isEditing && editingId === skill.id ? (
                                                <>
                                                    <SkillFields value={editingForm} onChange={setEditingForm} />
                                                    <div className="mt-4 flex gap-3">
                                                        <button type="button" onClick={() => setEditingId(null)} className="editor-secondary-button">Annuler</button>
                                                        <button type="button" onClick={() => handleUpdate(skill.id)} disabled={saving} className="editor-primary-button">{saving ? "Enregistrement..." : "Enregistrer la compétence"}</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <motion.div
                                                    variants={{ hover: { x: 10 } }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    className="grid items-center gap-6 md:grid-cols-[80px_1fr_1fr_60px]"
                                                >
                                                    <span className="text-xs text-white/30">{skill.number}</span>
                                                    <h3 className="text-3xl font-medium tracking-[-0.04em] md:text-5xl">{skill.title}</h3>
                                                    <p className="max-w-sm text-sm leading-relaxed text-white/30 md:text-base">{skill.description}</p>
                                                    {isEditing ? (
                                                        <div className="flex gap-2 md:flex-col">
                                                            <button type="button" onClick={() => startEditing(skill)} className="editor-link-button">Modifier</button>
                                                            <button type="button" onClick={() => void handleDelete(skill)} className="editor-delete-button">Supprimer</button>
                                                        </div>
                                                    ) : (
                                                        <span className="hidden text-xl md:block">↗</span>
                                                    )}
                                                </motion.div>
                                            )}
                                        </motion.article>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {!loading && skills.length === 0 && (
                            <div className="border-y border-white/10 py-12 text-sm uppercase tracking-[0.2em] text-white/30">
                                Aucune compétence ajoutée pour le moment.
                            </div>
                        )}

                        {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}
