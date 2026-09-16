import { Router } from "express";

import { requireAuth } from "../middleware/require-auth";
import { db } from "../prisma/db";
import { deleteCloudinaryImage } from "../services/cloudinary.service";

const router = Router();

interface ProjectImageInput {
    url: string;
    publicId?: string | null;
    alt: string;
    order?: number;
}

interface ProjectSectionInput {
    number?: string;
    title: string;
    content: string;
    order?: number;
}

interface ProjectRequestBody {
    title: string;
    slug: string;
    description: string;
    client?: string | null;
    role?: string | null;
    year?: number | null;
    category: string;
    coverImage: string;
    coverPublicId?: string | null;
    tools: string[];
    deliverables: string[];
    published?: boolean;
    featured?: boolean;
    order?: number;
    sections?: ProjectSectionInput[];
    images?: ProjectImageInput[];
}

const getProjectWithRelations = async (id: number) => {
    const projects = await db.orm.public.Project
        .where({ id })
        .include("sections")
        .include("images")
        .all();

    return projects[0];
};

const getProjectImagesPublicIds = (
    images: Array<{ publicId?: string | null }>,
): string[] => {
    return images
        .map((image) => image.publicId)
        .filter(
            (publicId): publicId is string =>
                Boolean(publicId),
        );
};

router.get("/", async (_req, res) => {
    try {
        const projects = await db.orm.public.Project
            .where({})
            .all();

        res.json(projects);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Impossible de récupérer les projets.",
        });
    }
});

router.get("/slug/:slug", async (req, res) => {
    try {
        const projects = await db.orm.public.Project
            .where({
                slug: req.params.slug,
            })
            .include("sections")
            .include("images")
            .all();

        const project = projects[0];

        if (!project) {
            res.status(404).json({
                message: "Projet introuvable.",
            });

            return;
        }

        res.json(project);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Impossible de récupérer le projet.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            res.status(400).json({
                message: "Identifiant de projet invalide.",
            });

            return;
        }

        const project = await getProjectWithRelations(id);

        if (!project) {
            res.status(404).json({
                message: "Projet introuvable.",
            });

            return;
        }

        res.json(project);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Impossible de récupérer le projet.",
        });
    }
});

router.post("/", requireAuth, async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            client,
            role,
            year,
            category,
            coverImage,
            coverPublicId,
            tools,
            deliverables,
            published,
            featured,
            order,
            sections,
            images,
        } = req.body as ProjectRequestBody;

        if (
            typeof title !== "string" ||
            typeof slug !== "string" ||
            typeof description !== "string" ||
            typeof category !== "string" ||
            typeof coverImage !== "string" ||
            !Array.isArray(tools) ||
            !Array.isArray(deliverables)
        ) {
            res.status(400).json({
                message: "Les données du projet sont invalides.",
            });

            return;
        }

        const normalizedTitle = title.trim();
        const normalizedSlug = slug.trim();
        const normalizedDescription = description.trim();
        const normalizedCategory = category.trim();
        const normalizedCoverImage = coverImage.trim();

        if (
            !normalizedTitle ||
            !normalizedSlug ||
            !normalizedDescription ||
            !normalizedCategory ||
            !normalizedCoverImage
        ) {
            res.status(400).json({
                message:
                    "Le titre, l'identifiant URL, la description, la catégorie et l'image de couverture sont obligatoires.",
            });

            return;
        }

        const existingProjects = await db.orm.public.Project
            .where({
                slug: normalizedSlug,
            })
            .all();

        if (existingProjects.length > 0) {
            res.status(409).json({
                message:
                    "Un projet utilise déjà cet identifiant URL.",
            });

            return;
        }

        const normalizedSections =
            sections?.map((section, index) => ({
                number: String(index + 1).padStart(2, "0"),
                title: section.title.trim(),
                content: section.content.trim(),
                order: index,
            })) ?? [];

        const normalizedImages =
            images
                ?.filter((image) => image.url.trim())
                .map((image, index) => ({
                    url: image.url.trim(),
                    publicId: image.publicId?.trim() || null,
                    alt: image.alt.trim(),
                    order: index,
                })) ?? [];

        const invalidSection = normalizedSections.some(
            (section) =>
                !section.title ||
                !section.content,
        );

        if (invalidSection) {
            res.status(400).json({
                message:
                    "Chaque section doit avoir un titre et un contenu.",
            });

            return;
        }

        const project =
            await db.orm.public.Project.create({
                title: normalizedTitle,
                slug: normalizedSlug,
                description: normalizedDescription,
                client: client?.trim() || null,
                role: role?.trim() || null,
                year: year ?? null,
                category: normalizedCategory,
                coverImage: normalizedCoverImage,
                coverPublicId:
                    coverPublicId?.trim() || null,
                tools: tools
                    .map((tool) => tool.trim())
                    .filter(Boolean),
                deliverables: deliverables
                    .map((deliverable) =>
                        deliverable.trim(),
                    )
                    .filter(Boolean),
                published: published ?? false,
                featured: featured ?? false,
                order: order ?? 0,
                sections: (sectionsMutator) =>
                    sectionsMutator.create(
                        normalizedSections,
                    ),
                images: (imagesMutator) =>
                    imagesMutator.create(
                        normalizedImages,
                    ),
            });

        const savedProject =
            await getProjectWithRelations(project.id);

        res.status(201).json(savedProject);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Impossible de créer le projet.",
        });
    }
});

router.put("/:id", requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            res.status(400).json({
                message: "Identifiant de projet invalide.",
            });

            return;
        }

        const {
            title,
            slug,
            description,
            client,
            role,
            year,
            category,
            coverImage,
            coverPublicId,
            tools,
            deliverables,
            published,
            featured,
            order,
            sections,
            images,
        } = req.body as ProjectRequestBody;

        if (
            typeof title !== "string" ||
            typeof slug !== "string" ||
            typeof description !== "string" ||
            typeof category !== "string" ||
            typeof coverImage !== "string" ||
            !Array.isArray(tools) ||
            !Array.isArray(deliverables)
        ) {
            res.status(400).json({
                message: "Les données du projet sont invalides.",
            });

            return;
        }

        const normalizedTitle = title.trim();
        const normalizedSlug = slug.trim();
        const normalizedDescription = description.trim();
        const normalizedCategory = category.trim();
        const normalizedCoverImage = coverImage.trim();

        if (
            !normalizedTitle ||
            !normalizedSlug ||
            !normalizedDescription ||
            !normalizedCategory ||
            !normalizedCoverImage
        ) {
            res.status(400).json({
                message:
                    "Le titre, l'identifiant URL, la description, la catégorie et l'image de couverture sont obligatoires.",
            });

            return;
        }

        const existingProject =
            await getProjectWithRelations(id);

        if (!existingProject) {
            res.status(404).json({
                message: "Projet introuvable.",
            });

            return;
        }

        const projectsWithSameSlug =
            await db.orm.public.Project
                .where({
                    slug: normalizedSlug,
                })
                .all();

        const slugAlreadyUsed =
            projectsWithSameSlug.some(
                (project) => project.id !== id,
            );

        if (slugAlreadyUsed) {
            res.status(409).json({
                message:
                    "Un autre projet utilise déjà cet identifiant URL.",
            });

            return;
        }

        const oldCoverPublicId =
            existingProject.coverPublicId;

        const oldImagePublicIds =
            getProjectImagesPublicIds(
                existingProject.images,
            );

        const normalizedCoverPublicId =
            coverPublicId?.trim() || null;

        const normalizedSections =
            sections?.map((section, index) => ({
                number: String(index + 1).padStart(2, "0"),
                title: section.title.trim(),
                content: section.content.trim(),
                order: index,
            })) ?? [];

        const normalizedImages =
            images
                ?.filter((image) => image.url.trim())
                .map((image, index) => ({
                    url: image.url.trim(),
                    publicId: image.publicId?.trim() || null,
                    alt: image.alt.trim(),
                    order: index,
                })) ?? [];

        const invalidSection = normalizedSections.some(
            (section) =>
                !section.title ||
                !section.content,
        );

        if (invalidSection) {
            res.status(400).json({
                message:
                    "Chaque section doit avoir un titre et un contenu.",
            });

            return;
        }

        const newImagePublicIds =
            normalizedImages
                .map((image) => image.publicId)
                .filter(
                    (publicId): publicId is string =>
                        Boolean(publicId),
                );

        const imagesToDelete =
            oldImagePublicIds.filter(
                (publicId) =>
                    !newImagePublicIds.includes(publicId),
            );

        const coverWasReplaced =
            Boolean(oldCoverPublicId) &&
            oldCoverPublicId !==
                normalizedCoverPublicId;

        await db.orm.public.ProjectSection
            .where({
                projectId: id,
            })
            .delete();

        await db.orm.public.ProjectImage
            .where({
                projectId: id,
            })
            .delete();

        await db.orm.public.Project
            .where({
                id,
            })
            .update({
                title: normalizedTitle,
                slug: normalizedSlug,
                description: normalizedDescription,
                client: client?.trim() || null,
                role: role?.trim() || null,
                year: year ?? null,
                category: normalizedCategory,
                coverImage: normalizedCoverImage,
                coverPublicId: normalizedCoverPublicId,
                tools: tools
                    .map((tool) => tool.trim())
                    .filter(Boolean),
                deliverables: deliverables
                    .map((deliverable) =>
                        deliverable.trim(),
                    )
                    .filter(Boolean),
                published: published ?? false,
                featured: featured ?? false,
                order: order ?? 0,
                sections: (sectionsMutator) =>
                    sectionsMutator.create(
                        normalizedSections,
                    ),
                images: (imagesMutator) =>
                    imagesMutator.create(
                        normalizedImages,
                    ),
            });

        if (coverWasReplaced && oldCoverPublicId) {
            try {
                await deleteCloudinaryImage(
                    oldCoverPublicId,
                );
            } catch (error) {
                console.error(
                    `Impossible de supprimer l'ancienne image de couverture ${oldCoverPublicId} de Cloudinary :`,
                    error,
                );
            }
        }

        for (const publicId of imagesToDelete) {
            try {
                await deleteCloudinaryImage(publicId);
            } catch (error) {
                console.error(
                    `Impossible de supprimer l'ancienne image ${publicId} de Cloudinary :`,
                    error,
                );
            }
        }

        const updatedProject =
            await getProjectWithRelations(id);

        if (!updatedProject) {
            res.status(404).json({
                message:
                    "Le projet a été enregistré mais n'a pas pu être récupéré.",
            });

            return;
        }

        res.json(updatedProject);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Impossible de mettre à jour le projet.",
        });
    }
});

router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            res.status(400).json({
                message: "Identifiant de projet invalide.",
            });

            return;
        }

        const project =
            await getProjectWithRelations(id);

        if (!project) {
            res.status(404).json({
                message: "Projet introuvable.",
            });

            return;
        }

        const coverPublicId =
            project.coverPublicId;

        const imagePublicIds =
            getProjectImagesPublicIds(
                project.images,
            );

        await db.orm.public.Project
            .where({
                id,
            })
            .delete();

        if (coverPublicId) {
            try {
                await deleteCloudinaryImage(
                    coverPublicId,
                );
            } catch (error) {
                console.error(
                    `Impossible de supprimer l'image de couverture ${coverPublicId} de Cloudinary :`,
                    error,
                );
            }
        }

        for (const publicId of imagePublicIds) {
            try {
                await deleteCloudinaryImage(publicId);
            } catch (error) {
                console.error(
                    `Impossible de supprimer l'image ${publicId} de Cloudinary :`,
                    error,
                );
            }
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Impossible de supprimer le projet.",
        });
    }
});

export default router;