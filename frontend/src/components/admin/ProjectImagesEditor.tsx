import type { ChangeEvent } from "react";

import type { AdminProjectImage } from "../../types/admin-project";

interface ProjectImagesEditorProps {
    images: AdminProjectImage[];
    uploadingImages: Record<string, boolean>;
    saving: boolean;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (
        index: number,
        field: keyof AdminProjectImage,
        value: string | number,
    ) => void;
    onUpload: (
        event: ChangeEvent<HTMLInputElement>,
        index: number,
    ) => void;
}

export function ProjectImagesEditor({
    images,
    uploadingImages,
    saving,
    onAdd,
    onRemove,
    onChange,
    onUpload,
}: ProjectImagesEditorProps) {
    return (
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
                    onClick={onAdd}
                    className="w-fit rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.15em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                    + Ajouter image
                </button>
            </div>

            <div className="space-y-6">
                {images.map((image, index) => {
                    const imageId = String(image.id);
                    const isUploading = Boolean(uploadingImages[imageId]);

                    return (
                        <article
                            key={image.id}
                            className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-sm text-white/30">
                                    Image {String(index + 1).padStart(2, "0")}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    disabled={isUploading}
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
                                            isUploading ? "cursor-wait opacity-50" : ""
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isUploading || saving}
                                            onChange={(event) => onUpload(event, index)}
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
                                        onChange={(event) =>
                                            onChange(index, "alt", event.target.value)
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
                                        alt={image.alt}
                                        className="aspect-video w-full object-cover"
                                    />
                                </div>
                            )}
                        </article>
                    );
                })}

                {images.length === 0 && (
                    <div className="rounded-[2rem] border border-dashed border-white/10 py-16 text-center">
                        <p className="text-white/30">Aucune image dans la galerie.</p>
                    </div>
                )}
            </div>
        </section>
    );
}