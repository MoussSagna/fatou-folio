import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";

import { AnimatedLoader, Footer, Navbar, Reveal } from "../../components";
import { getProjectBySlug } from "../../services";
import type { Project } from "../../types/";

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            setError("Projet introuvable.");
            return;
        }

        const loadProject = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProjectBySlug(slug);

                setProject(data);
            } catch (requestError) {
                console.error(requestError);
                setError("Projet introuvable.");
            } finally {
                setLoading(false);
            }
        };

        void loadProject();
    }, [slug]);

    if (loading) {
        return <AnimatedLoader />;
    }

    if (error || !project) {
        return (
            <main className="min-h-screen bg-[#111111] px-6 py-32 text-white md:px-12">
                <Navbar />

                <div className="mx-auto max-w-[1600px]">
                    <p className="mb-8 text-4xl font-medium">
                        {error ?? "Projet introuvable."}
                    </p>

                    <Link
                        to="/projects"
                        className="text-sm uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
                    >
                        ← Retour aux projets
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#111111] text-white">
            <Navbar />

            <section className="px-6 pb-20 pt-40 md:px-12 md:pb-32 md:pt-48">
                <div className="mx-auto max-w-[1600px]">
                    <Reveal>
                        <Link
                            to="/projects"
                            className="mb-12 inline-flex text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
                        >
                            ← Retour aux projets
                        </Link>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="grid gap-10 lg:grid-cols-[1fr_0.35fr] lg:items-end">
                            <div>
                                <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                    <span>{project.category}</span>
                                </div>

                                <h1 className="max-w-6xl text-6xl font-medium leading-[0.85] tracking-[-0.07em] md:text-8xl lg:text-[9rem]">
                                    {project.title}
                                </h1>
                            </div>

                            <p className="max-w-md text-base leading-relaxed text-white/40 md:text-lg">
                                {project.description}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="px-6 pb-24 md:px-12 md:pb-40">
                <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] bg-white/5">
                    <motion.img
                        layoutId={`project-image-${project.id}`}
                        src={project.coverImage}
                        alt={project.title}
                        className="aspect-[16/8] w-full object-cover"
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />
                </div>
            </section>

            <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24">
                <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-4">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
                            Client
                        </p>
                        <p className="text-lg">{project.client || "—"}</p>
                    </div>

                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
                            Rôle
                        </p>
                        <p className="text-lg">{project.role || "—"}</p>
                    </div>

                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
                            Année
                        </p>
                        <p className="text-lg">{project.year || "—"}</p>
                    </div>

                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
                            Catégorie
                        </p>
                        <p className="text-lg">{project.category}</p>
                    </div>
                </div>
            </section>

            <section className="px-6 py-24 md:px-12 md:py-40">
                <div className="mx-auto max-w-[1200px]">
                    <div className="mb-20 grid gap-12 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                Outils
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {project.tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="text-xl text-white/70 md:text-2xl"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-12 md:grid-cols-[0.35fr_1fr]">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                Livrables
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {project.deliverables.map((deliverable) => (
                                <span
                                    key={deliverable}
                                    className="text-xl text-white/70 md:text-2xl"
                                >
                                    {deliverable}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 pb-32 md:px-12 md:pb-48">
                <div className="mx-auto max-w-[1200px]">
                    <div className="space-y-24 md:space-y-40">
                        {project.sections
                            .sort((a, b) => a.order - b.order)
                            .map((section) => (
                                <Reveal key={section.id}>
                                    <article className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[0.2fr_0.8fr]">
                                        <div>
                                            <p className="text-sm text-white/30">
                                                {section.number}
                                            </p>
                                        </div>

                                        <div>
                                            <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
                                                {section.title}
                                            </h2>

                                            <p className="mt-8 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-white/50 md:text-xl">
                                                {section.content}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                    </div>
                </div>
            </section>

            {project.images.length > 0 && (
                <section className="px-6 pb-32 md:px-12 md:pb-48">
                    <div className="mx-auto max-w-[1600px]">
                        <div className="mb-8 border-b border-white/10 pb-5">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                                Galerie du projet
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {project.images
                                .sort((a, b) => a.order - b.order)
                                .map((image) => (
                                    <Reveal key={image.id}>
                                        <div className="overflow-hidden rounded-[2rem] bg-white/5">
                                            <img
                                                src={image.url}
                                                alt={image.alt || project.title}
                                                className="w-full object-cover"
                                            />
                                        </div>
                                    </Reveal>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="border-t border-white/10 px-6 py-24 md:px-12 md:py-32">
                <div className="mx-auto max-w-[1600px]">
                    <Reveal>
                        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/30">
                            Projet suivant
                        </p>

                        <Link
                            to="/projects"
                            className="group flex items-end justify-between border-b border-white/10 pb-6"
                        >
                            <span className="text-4xl font-medium tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-2 md:text-7xl">
                                Voir tous les projets
                            </span>

                            <span className="text-3xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                                ↗
                            </span>
                        </Link>
                    </Reveal>
                </div>
            </section>

            <Footer />
        </main>
    );
}