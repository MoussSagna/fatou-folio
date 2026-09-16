import type { FormEvent } from "react";

import type { Experience } from "../../types";

type ExperienceForm = Omit<Experience, "id">;

interface ExperiencesManagerProps {
    experiences: Experience[];
    experienceForm: ExperienceForm;
    editingExperienceId: number | null;
    saving: boolean;
    onChange: (field: keyof ExperienceForm, value: string | number) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onEdit: (experience: Experience) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
}

export function ExperiencesManager({
    experiences,
    experienceForm,
    editingExperienceId,
    saving,
    onChange,
    onSubmit,
    onEdit,
    onDelete,
    onCancel,
}: ExperiencesManagerProps) {
    return (
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

            <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
                <input
                    placeholder="Période"
                    value={experienceForm.period}
                    onChange={(event) => onChange("period", event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />
                <input
                    placeholder="Entreprise"
                    value={experienceForm.company}
                    onChange={(event) => onChange("company", event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />
                <input
                    placeholder="Poste"
                    value={experienceForm.role}
                    onChange={(event) => onChange("role", event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />
                <input
                    placeholder="Lieu"
                    value={experienceForm.location ?? ""}
                    onChange={(event) => onChange("location", event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />
                <textarea
                    placeholder="Description"
                    value={experienceForm.description}
                    onChange={(event) => onChange("description", event.target.value)}
                    rows={5}
                    className="resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30 md:col-span-2"
                />
                <input
                    type="number"
                    placeholder="Ordre"
                    value={experienceForm.order}
                    onChange={(event) => onChange("order", Number(event.target.value))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
                    >
                        {saving
                            ? "Enregistrement..."
                            : editingExperienceId
                                ? "Modifier"
                                : "Ajouter"}
                    </button>

                    {editingExperienceId && (
                        <button
                            type="button"
                            onClick={onCancel}
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
                                <h3 className="mt-2 text-xl font-medium">{experience.role}</h3>
                                <p className="mt-1 text-sm text-white/50">
                                    {experience.company}
                                    {experience.location ? ` · ${experience.location}` : ""}
                                </p>
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/40">
                                    {experience.description}
                                </p>
                            </div>

                            <div className="flex shrink-0 gap-3">
                                <button
                                    type="button"
                                    onClick={() => onEdit(experience)}
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-white/40 hover:text-white"
                                >
                                    Modifier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(experience.id)}
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
    );
}