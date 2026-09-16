import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Footer, Navbar, Reveal } from "../../components";
import ProjectCard from "../../components/projects/ProjectCard";
import { getProjects } from "../../services/";
import type { Project } from "../../types/";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();

                setProjects(data);
            } catch (requestError) {
                console.error(requestError);
                setError("Impossible de charger les projets.");
            } finally {
                setLoading(false);
            }
        };

        void loadProjects();
    }, []);

    const publishedProjects = projects
        .filter((project) => project.published)
        .sort((a, b) => a.order - b.order);

    return (
        <main className="min-h-screen overflow-hidden bg-[#111111] text-white">
            <Navbar />

            <section className="px-6 pb-24 pt-40 md:px-12 md:pb-32 md:pt-48">
                <div className="mx-auto max-w-[1600px]">
                    <Reveal>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            <span>Projets sélectionnés</span>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                            <h1 className="max-w-6xl text-6xl font-medium leading-[0.85] tracking-[-0.07em] md:text-8xl lg:text-[10rem]">
                                Projets
                                <br />
                                sélectionnés.
                            </h1>

                            <p className="max-w-sm text-base leading-relaxed text-white/40 md:pb-3 md:text-lg">
                                Une sélection d'expériences numériques, d'interfaces et de
                                produits conçus avec intention.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="px-6 pb-32 md:px-12 md:pb-48">
                <div className="mx-auto max-w-[1600px]">
                    <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                            Projets
                        </p>

                        <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                            {String(publishedProjects.length).padStart(2, "0")} projets
                        </p>
                    </div>

                    {loading && (
                        <div className="border-b border-white/10 py-24">
                            <p className="text-2xl text-white/40">
                                Chargement des projets...
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="border-b border-white/10 py-24">
                            <p className="text-2xl text-red-300">{error}</p>
                        </div>
                    )}

                    {!loading && !error && publishedProjects.length > 0 && (
                        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-32">
                            {publishedProjects.map((project, index) => (
                                <Reveal key={project.id} delay={(index % 2) * 0.1}>
                                    <ProjectCard project={project} />
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {!loading && !error && publishedProjects.length === 0 && (
                        <div className="border-b border-white/10 py-24">
                            <p className="text-2xl text-white/40">
                                Aucun projet disponible.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="border-t border-white/10 px-6 py-24 md:px-12 md:py-32">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <Reveal>
                        <div>
                            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/30">
                                Vous avez un projet en tête ?
                            </p>

                            <h2 className="max-w-3xl text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
                                Créons quelque chose de significatif.
                            </h2>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <Link
                            to="/#contact"
                            className="group flex w-fit items-center gap-4 border-b border-white/20 pb-3 text-sm uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:border-white hover:text-white"
                        >
                            Démarrer une conversation

                            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
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