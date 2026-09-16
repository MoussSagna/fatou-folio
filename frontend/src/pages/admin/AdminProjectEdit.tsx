import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AnimatedLoader } from "../../components";
import { uploadImage } from "../../services";
import type {
    Project,
    ProjectImage,
    ProjectSection,
} from "../../types/";

const API_URL = process.env

interface AdminProjectImage extends Omit<ProjectImage, "id"> {
    id: string | number;
}

interface AdminProjectSection extends Omit<ProjectSection, "id"> {
    id: string | number;
}

interface AdminProject
    extends Omit<Project, "id" | "sections" | "images"> {
    id: string | number;
    sections: AdminProjectSection[];
    images: AdminProjectImage[];
}

const createEmptySection = (
    order: number,
): AdminProjectSection => ({
    id: `section-${Date.now()}-${order}`,
    number: String(order + 1).padStart(2, "0"),
    title: "",
    content: "",
    order,
});

const createEmptyImage = (
    order: number,
): AdminProjectImage => ({
    id: `image-${Date.now()}-${order}`,
    url: "",
    alt: "",
    order,
});

const emptyProject: AdminProject = {
    id: "",
    title: "",
    slug: "",
    description: "",
    client: "",
    role: "",
    year: new Date().getFullYear(),
    category: "",
    coverImage: "",
    tools: [],
    deliverables: [],
    sections: [createEmptySection(0)],
    published: false,
    featured: false,
    order: 0,
    images: [],
};

export default function AdminProjectEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const isCreating = !id;

    const [form, setForm] = useState<AdminProject>(emptyProject);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<
        Record<string, boolean>
    >({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isCreating || !id) {
            return;
        }

        const loadProject = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${API_URL}/projects/${id}`,
                    {
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    const errorBody = await response.text();

                    console.error(
                        "LOAD PROJECT STATUS:",
                        response.status,
                    );
                    console.error(
                        "LOAD PROJECT RESPONSE:",
                        errorBody,
                    );

                    throw new Error(
                        `Unable to load project (${response.status})`,
                    );
                }

                const project = (await response.json()) as Project;

                setForm({
                    ...project,
                    tools: project.tools ?? [],
                    deliverables: project.deliverables ?? [],
                    sections: (project.sections ?? []).map(
                        (section) => ({
                            ...section,
                            id: section.id,
                        }),
                    ),
                    images: (project.images ?? []).map((image) => ({
                        ...image,
                        id: image.id,
                    })),
                });
            } catch (requestError) {
                console.error("LOAD PROJECT ERROR:", requestError);

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Impossible de charger le projet.",
                );
            } finally {
                setLoading(false);
            }
        };

        void loadProject();
    }, [id, isCreating]);

    const updateField = <K extends keyof AdminProject>(
        field: K,
        value: AdminProject[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const updateArrayItem = (
        field: "tools" | "deliverables",
        index: number,
        value: string,
    ) => {
        setForm((current) => {
            const items = [...current[field]];

            items[index] = value;

            return {
                ...current,
                [field]: items,
            };
        });
    };

    const addArrayItem = (
        field: "tools" | "deliverables",
    ) => {
        setForm((current) => ({
            ...current,
            [field]: [...current[field], ""],
        }));
    };

    const removeArrayItem = (
        field: "tools" | "deliverables",
        index: number,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: current[field].filter(
                (_, itemIndex) => itemIndex !== index,
            ),
        }));
    };

    const updateSection = (
        sectionIndex: number,
        field: keyof AdminProjectSection,
        value: string | number,
    ) => {
        setForm((current) => ({
            ...current,
            sections: current.sections.map(
                (section, index) =>
                    index === sectionIndex
                        ? {
                            ...section,
                            [field]: value,
                        }
                        : section,
            ),
        }));
    };

    const addSection = () => {
        setForm((current) => ({
            ...current,
            sections: [
                ...current.sections,
                createEmptySection(current.sections.length),
            ],
        }));
    };

    const removeSection = (index: number) => {
        setForm((current) => ({
            ...current,
            sections: current.sections
                .filter(
                    (_, sectionIndex) => sectionIndex !== index,
                )
                .map((section, sectionIndex) => ({
                    ...section,
                    order: sectionIndex,
                    number: String(sectionIndex + 1).padStart(
                        2,
                        "0",
                    ),
                })),
        }));
    };

    const updateImage = (
        imageIndex: number,
        field: keyof AdminProjectImage,
        value: string | number,
    ) => {
        setForm((current) => ({
            ...current,
            images: current.images.map(
                (image, index) =>
                    index === imageIndex
                        ? {
                            ...image,
                            [field]: value,
                        }
                        : image,
            ),
        }));
    };

    const addImage = () => {
        setForm((current) => ({
            ...current,
            images: [
                ...current.images,
                createEmptyImage(current.images.length),
            ],
        }));
    };

    const removeImage = (index: number) => {
        setForm((current) => ({
            ...current,
            images: current.images
                .filter(
                    (_, imageIndex) => imageIndex !== index,
                )
                .map((image, imageIndex) => ({
                    ...image,
                    order: imageIndex,
                })),
        }));
    };

    const handleCoverUpload = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploadingCover(true);
            setError(null);
            setSuccess(null);

            const result = await uploadImage(file);

            setForm((current) => ({
                ...current,
                coverImage: result.url,
                coverPublicId: result.publicId,
            }));

            setSuccess(
                "Image de couverture uploaded successfully.",
            );
        } catch (uploadError) {
            console.error(
                "COVER UPLOAD ERROR:",
                uploadError,
            );

            setError(
                uploadError instanceof Error
                    ? uploadError.message
                    : "Unable to upload cover image.",
            );
        } finally {
            setUploadingCover(false);
            event.target.value = "";
        }
    };

    const handleGalerieUpload = async (
        event: ChangeEvent<HTMLInputElement>,
        imageIndex: number,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const imageId = String(
            form.images[imageIndex]?.id ?? imageIndex,
        );

        try {
            setUploadingImages((current) => ({
                ...current,
                [imageId]: true,
            }));

            setError(null);
            setSuccess(null);

            const result = await uploadImage(file);

            setForm((current) => ({
                ...current,
                images: current.images.map(
                    (image, index) =>
                        index === imageIndex
                            ? {
                                ...image,
                                url: result.url,
                                publicId: result.publicId,
                            }
                            : image,
                ),
            }));

            setSuccess(
                "Galerie image uploaded successfully.",
            );
        } catch (uploadError) {
            console.error(
                "GALLERY UPLOAD ERROR:",
                uploadError,
            );

            setError(
                uploadError instanceof Error
                    ? uploadError.message
                    : "Unable to upload gallery image.",
            );
        } finally {
            setUploadingImages((current) => {
                const next = { ...current };

                delete next[imageId];

                return next;
            });

            event.target.value = "";
        }
    };

    const isUploading =
        uploadingCover ||
        Object.keys(uploadingImages).length > 0;

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (saving || isUploading) {
            return;
        }

        const title = form.title.trim();
        const slug = form.slug.trim();
        const description = form.description.trim();
        const category = form.category.trim();

        if (!title || !slug || !description || !category) {
            setError(
                "Veuillez renseigner le titre, l'identifiant URL, la description et la catégorie.",
            );
            return;
        }

        const invalidSection = form.sections.some(
            (section) =>
                !section.title.trim() ||
                !section.content.trim(),
        );

        if (invalidSection) {
            setError(
                "Chaque section doit avoir un titre et un contenu.",
            );
            return;
        }

        if (!form.coverImage.trim()) {
            setError("Veuillez ajouter une image de couverture.");
            return;
        }

        if (isUploading) {
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const payload = {
                title,
                slug,
                description,
                client: form.client?.trim() || null,
                role: form.role?.trim() || null,
                year: form.year || null,
                category,

                coverImage: form.coverImage.trim(),
                coverPublicId: form.coverPublicId?.trim() || null,

                tools: form.tools
                    .map((tool) => tool.trim())
                    .filter(Boolean),

                deliverables: form.deliverables
                    .map((deliverable) => deliverable.trim())
                    .filter(Boolean),

                sections: form.sections.map(
                    (section, index) => ({
                        number: String(index + 1).padStart(2, "0"),
                        title: section.title.trim(),
                        content: section.content.trim(),
                        order: index,
                    }),
                ),

                images: form.images
                    .filter((image) => image.url.trim())
                    .map((image, index) => ({
                        url: image.url.trim(),
                        publicId: image.publicId?.trim() || null,
                        alt: image.alt.trim(),
                        order: index,
                    })),

                published: form.published,
                featured: form.featured,
                order: form.order,
            };

            const url = isCreating
                ? `${API_URL}/projects`
                : `${API_URL}/projects/${id}`;

            const method = isCreating ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Contenu-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.text();

                console.error(
                    "SAVE PROJECT STATUS:",
                    response.status,
                );
                console.error(
                    "SAVE PROJECT RESPONSE:",
                    errorBody,
                );

                throw new Error(
                    `Unable to save project (${response.status})`,
                );
            }

            const savedProject =
                (await response.json()) as Project;

            setForm({
                ...savedProject,
                tools: savedProject.tools ?? [],
                deliverables:
                    savedProject.deliverables ?? [],
                sections: (savedProject.sections ?? []).map(
                    (section) => ({
                        ...section,
                        id: section.id,
                    }),
                ),
                images: (savedProject.images ?? []).map(
                    (image) => ({
                        ...image,
                        id: image.id,
                    }),
                ),
            });

            setSuccess(
                isCreating
                    ? "Projet créé avec succès."
                    : "Projet mis à jour avec succès.",
            );

            if (isCreating) {
                navigate(
                    `/admin/projects/${savedProject.id}`,
                    {
                        replace: true,
                    },
                );
            }
        } catch (requestError) {
            console.error(
                "SAVE PROJECT ERROR:",
                requestError,
            );

            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Impossible d'enregistrer le projet.",
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <AnimatedLoader />;
    }

    return (
        <main className="min-h-screen bg-[#111111] px-6 py-12 text-white md:px-12 md:py-16">
            <div className="mx-auto max-w-[1400px]">
                <header className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <Link
                            to="/admin/projects"
                            className="mb-6 inline-flex text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
                        >
                            ← Retour aux projets
                        </Link>

                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30">
                            {isCreating
                                ? "Nouveau projet"
                                : "Modifier le projet"}
                        </p>

                        <h1 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                            {isCreating
                                ? "Créer un projet."
                                : form.title || "Modifier le projet."}
                        </h1>
                    </div>

                    <button
                        type="submit"
                        form="project-form"
                        disabled={saving || isUploading}
                        className="w-fit rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isUploading
                            ? "Téléchargement..."
                            : saving
                                ? "Enregistrement..."
                                : isCreating
                                    ? "Créer le projet"
                                    : "Enregistrer les modifications"}
                    </button>
                </header>

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-8 rounded-2xl border border-green-400/20 bg-green-400/5 px-5 py-4 text-sm text-green-300">
                        {success}
                    </div>
                )}

                <form
                    id="project-form"
                    onSubmit={handleSubmit}
                    className="space-y-16"
                >
                    <section>
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                01
                            </p>

                            <h2 className="mt-2 text-3xl font-medium tracking-tight">
                                Informations générales
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Titre
                </span>

                                <input
                                    value={form.title}
                                    onChange={(event) =>
                                        updateField(
                                            "title",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                                    placeholder="SACEM Digital Experience"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Identifiant URL
                </span>

                                <input
                                    value={form.slug}
                                    onChange={(event) =>
                                        updateField(
                                            "slug",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                                    placeholder="sacem-digital-experience"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Client
                </span>

                                <input
                                    value={form.client ?? ""}
                                    onChange={(event) =>
                                        updateField(
                                            "client",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Rôle
                </span>

                                <input
                                    value={form.role ?? ""}
                                    onChange={(event) =>
                                        updateField(
                                            "role",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Année
                </span>

                                <input
                                    type="number"
                                    value={form.year ?? ""}
                                    onChange={(event) =>
                                        updateField(
                                            "year",
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                                />
                            </label>

                            <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Catégorie
                </span>

                                <input
                                    value={form.category}
                                    onChange={(event) =>
                                        updateField(
                                            "category",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                                />
                            </label>
                        </div>

                        <label className="mt-6 block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Description
              </span>

                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    updateField(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                required
                                rows={5}
                                className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                            />
                        </label>
                    </section>

                    <section>
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                02
                            </p>

                            <h2 className="mt-2 text-3xl font-medium tracking-tight">
                                Image de couverture
                            </h2>
                        </div>

                        <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Image
              </span>

                            <label
                                className={`flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center transition-colors hover:border-white/30 hover:bg-white/[0.08] ${
                                    uploadingCover
                                        ? "cursor-wait opacity-50"
                                        : ""
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={
                                        uploadingCover || saving
                                    }
                                    onChange={handleCoverUpload}
                                />

                                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {uploadingCover
                        ? "Téléchargement..."
                        : form.coverImage
                            ? "Remplacer l'image de couverture"
                            : "Choisir une image de couverture"}
                  </span>

                                    <span className="text-xs text-white/20">
                    JPG, PNG, WEBP
                  </span>
                                </div>
                            </label>
                        </div>

                        {form.coverImage && (
                            <div className="mt-6 overflow-hidden rounded-[2rem] bg-white/5">
                                <img
                                    src={form.coverImage}
                                    alt={form.title}
                                    className="aspect-[16/7] w-full object-cover"
                                />
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                03
                            </p>

                            <h2 className="mt-2 text-3xl font-medium tracking-tight">
                                Outils et livrables
                            </h2>
                        </div>

                        <div className="grid gap-10 md:grid-cols-2">
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Outils
                  </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem("tools")
                                        }
                                        className="text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white"
                                    >
                                        + Ajouter
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {form.tools.map(
                                        (tool, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-3"
                                            >
                                                <input
                                                    value={tool}
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "tools",
                                                            index,
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                                                    placeholder="Figma"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeArrayItem(
                                                            "tools",
                                                            index,
                                                        )
                                                    }
                                                    className="px-3 text-white/30 hover:text-white"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Livrables
                  </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem(
                                                "deliverables",
                                            )
                                        }
                                        className="text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white"
                                    >
                                        + Ajouter
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {form.deliverables.map(
                                        (deliverable, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-3"
                                            >
                                                <input
                                                    value={deliverable}
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "deliverables",
                                                            index,
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                                                    placeholder="Recherche utilisateur"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeArrayItem(
                                                            "deliverables",
                                                            index,
                                                        )
                                                    }
                                                    className="px-3 text-white/30 hover:text-white"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

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
                                onClick={addSection}
                                className="w-fit rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.15em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
                            >
                                + Ajouter section
                            </button>
                        </div>

                        <div className="space-y-8">
                            {form.sections.map(
                                (section, index) => (
                                    <article
                                        key={section.id}
                                        className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 md:p-8"
                                    >
                                        <div className="mb-6 flex items-center justify-between">
                      <span className="text-sm text-white/30">
                        Section{" "}
                          {String(index + 1).padStart(
                              2,
                              "0",
                          )}
                      </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSection(index)
                                                }
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
                                                        updateSection(
                                                            index,
                                                            "number",
                                                            event.target.value,
                                                        )
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
                                                        updateSection(
                                                            index,
                                                            "title",
                                                            event.target.value,
                                                        )
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
                                                    updateSection(
                                                        index,
                                                        "content",
                                                        event.target.value,
                                                    )
                                                }
                                                rows={7}
                                                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-relaxed outline-none focus:border-white/30"
                                            />
                                        </label>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                    05
                                </p>

                                <h2 className="mt-2 text-3xl font-medium tracking-tight">
                                    Galerie
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={addImage}
                                className="w-fit rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.15em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
                            >
                                + Ajouter image
                            </button>
                        </div>

                        <div className="space-y-6">
                            {form.images.map(
                                (image, index) => {
                                    const imageId = String(
                                        image.id,
                                    );

                                    const isUploading =
                                        Boolean(
                                            uploadingImages[
                                                imageId
                                                ],
                                        );

                                    return (
                                        <article
                                            key={image.id}
                                            className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6"
                                        >
                                            <div className="mb-5 flex items-center justify-between">
                        <span className="text-sm text-white/30">
                          Image{" "}
                            {String(
                                index + 1,
                            ).padStart(2, "0")}
                        </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            index,
                                                        )
                                                    }
                                                    disabled={
                                                        isUploading
                                                    }
                                                    className="text-xs uppercase tracking-[0.15em] text-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>

                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="space-y-3">
                          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Image
                          </span>

                                                    <label
                                                        className={`flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center transition-colors hover:border-white/30 hover:bg-white/[0.08] ${
                                                            isUploading
                                                                ? "cursor-wait opacity-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            disabled={
                                                                isUploading ||
                                                                saving
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) => {
                                                                void handleGalerieUpload(
                                                                    event,
                                                                    index,
                                                                );
                                                            }}
                                                        />

                                                        <div className="flex flex-col items-center gap-2">
                              <span className="text-xs uppercase tracking-[0.15em] text-white/50">
                                {isUploading
                                    ? "Téléchargement..."
                                    : image.url
                                        ? "Remplacer l'image"
                                        : "Choisir une image"}
                              </span>

                                                            <span className="text-xs text-white/20">
                                JPG, PNG, WEBP
                              </span>
                                                        </div>
                                                    </label>

                                                    {image.url && (
                                                        <p className="truncate text-xs text-white/20">
                                                            {image.url}
                                                        </p>
                                                    )}
                                                </div>

                                                <label className="space-y-2">
                          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Texte alternatif
                          </span>

                                                    <input
                                                        value={image.alt}
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            updateImage(
                                                                index,
                                                                "alt",
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"
                                                        placeholder="Tableau de bord de la page d’accueil"
                                                    />
                                                </label>
                                            </div>

                                            {image.url && (
                                                <div className="mt-5 overflow-hidden rounded-2xl bg-white/5">
                                                    <img
                                                        src={image.url}
                                                        alt={
                                                            image.alt
                                                        }
                                                        className="aspect-video w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </article>
                                    );
                                },
                            )}

                            {form.images.length === 0 && (
                                <div className="rounded-[2rem] border border-dashed border-white/10 py-16 text-center">
                                    <p className="text-white/30">
                                        Aucune image dans la galerie.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                06
                            </p>

                            <h2 className="mt-2 text-3xl font-medium tracking-tight">
                                Publication
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <input
                                    type="checkbox"
                                    checked={form.published}
                                    onChange={(event) =>
                                        updateField(
                                            "published",
                                            event.target.checked,
                                        )
                                    }
                                    className="h-5 w-5"
                                />

                                <span>
                  <strong className="block text-sm font-medium">
                    Publié
                  </strong>

                  <span className="text-xs text-white/30">
                    Visible sur le portfolio public
                  </span>
                </span>
                            </label>

                            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(event) =>
                                        updateField(
                                            "featured",
                                            event.target.checked,
                                        )
                                    }
                                    className="h-5 w-5"
                                />

                                <span>
                  <strong className="block text-sm font-medium">
                    Mis en avant
                  </strong>

                  <span className="text-xs text-white/30">
                    Affiché dans les projets sélectionnés
                  </span>
                </span>
                            </label>

                            <label className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <span className="block text-xs uppercase tracking-[0.2em] text-white/40">
                  Ordre
                </span>

                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={(event) =>
                                        updateField(
                                            "order",
                                            Number(event.target.value),
                                        )
                                    }
                                    className="w-full bg-transparent text-lg outline-none"
                                />
                            </label>
                        </div>
                    </section>

                    <div className="flex items-center justify-between border-t border-white/10 pt-8">
                        <Link
                            to="/admin/projects"
                            className="text-sm text-white/40 transition-colors hover:text-white"
                        >
                            Annuler
                        </Link>

                        <button
                            type="submit"
                            disabled={saving || isUploading}
                            className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isUploading
                                ? "Téléchargement..."
                                : saving
                                    ? "Enregistrement..."
                                    : isCreating
                                        ? "Créer le projet"
                                        : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
