import type { AdminProjectSection } from "../../types/admin-project";

interface ProjectSectionsEditorProps {
    sections: AdminProjectSection[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (
        index: number,
        field: keyof AdminProjectSection,
        value: string | number,
    ) => void;
}

export function ProjectSectionsEditor({
    sections,
    onAdd,
    onRemove,
    onChange,
}: ProjectSectionsEditorProps) {
    return (
        <section>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                        04
                    </p>

                    <h2 className="mt-2 text-3xl font-medium tracking-tight">
                        Étude de cas
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onAdd}
                    className="w-fit rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.15em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                    + Ajouter section
                </button>
            </div>

            <div className="space-y-8">
                {sections.map((section, index) => (
                    <article
                        key={section.id}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 md:p-8"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-sm text-white/30">
                                Section {String(index + 1).padStart(2, "0")}
                            </span>

                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="text-xs uppercase tracking-[0.15em] text-white/30 hover:text-white"
                            >
                                Supprimer
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-[120px_1fr]">
                            <label className="space-y-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                                    Numéro
                                </span>

                                <input
                                    value={section.number}
                                    onChange={(event) =>
                                        onChange(index, "number", event.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                                    Titre
                                </span>

                                <input
                                    value={section.title}
                                    onChange={(event) =>
                                        onChange(index, "title", event.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                                    placeholder="Recherche et découverte"
                                />
                            </label>
                        </div>

                        <label className="mt-6 block space-y-2">
                            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                                Contenu
                            </span>

                            <textarea
                                value={section.content}
                                onChange={(event) =>
                                    onChange(index, "content", event.target.value)
                                }
                                rows={7}
                                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-relaxed outline-none focus:border-white/30"
                            />
                        </label>
                    </article>
                ))}
            </div>
        </section>
    );
}