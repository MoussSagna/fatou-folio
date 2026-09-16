import type { FormEvent } from "react";

import type { Skill } from "../../types";

type SkillForm = Omit<Skill, "id">;

interface SkillsManagerProps {
    skills: Skill[];
    skillForm: SkillForm;
    editingSkillId: number | null;
    saving: boolean;
    onChange: (field: keyof SkillForm, value: string | number) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onEdit: (skill: Skill) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
}

export function SkillsManager({
    skills,
    skillForm,
    editingSkillId,
    saving,
    onChange,
    onSubmit,
    onEdit,
    onDelete,
    onCancel,
}: SkillsManagerProps) {
    return (
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

            <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
                <input
                    placeholder="Numéro"
                    value={skillForm.number}
                    onChange={(event) => onChange("number", event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />

                <input
                    placeholder="Titre"
                    value={skillForm.title}
                    onChange={(event) => onChange("title", event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />

                <textarea
                    placeholder="Description"
                    value={skillForm.description}
                    onChange={(event) => onChange("description", event.target.value)}
                    rows={4}
                    className="resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30 md:col-span-2"
                />

                <input
                    type="number"
                    placeholder="Ordre"
                    value={skillForm.order}
                    onChange={(event) => onChange("order", Number(event.target.value))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
                    >
                        {saving ? "Enregistrement..." : editingSkillId ? "Modifier" : "Ajouter"}
                    </button>

                    {editingSkillId && (
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
                {skills
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((skill) => (
                        <div
                            key={skill.id}
                            className="flex flex-col gap-5 border-b border-white/10 py-6 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <p className="text-xs text-white/30">{skill.number}</p>
                                <h3 className="mt-1 text-xl font-medium">{skill.title}</h3>
                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
                                    {skill.description}
                                </p>
                            </div>

                            <div className="flex shrink-0 gap-3">
                                <button
                                    type="button"
                                    onClick={() => onEdit(skill)}
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-white/40 hover:text-white"
                                >
                                    Modifier
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(skill.id)}
                                    className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-300 transition hover:border-red-400/40"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}