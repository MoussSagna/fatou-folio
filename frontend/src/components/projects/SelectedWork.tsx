import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../../services/";
import type { Project } from "../../types/";
import ProjectCard from "./ProjectCard";

export default function SelectedWork() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void loadProjects();
    }, []);

    const featuredProjects = projects
        .filter((project) => project.published && project.featured)
        .sort((a, b) => a.order - b.order)
        .slice(0, 3);

    return (
        <section id="work" className="px-6 py-24 md:px-12 md:py-40">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/30">
                            Projets sélectionnés
                        </p>

                        <h2 className="text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-8xl">
                            Quelques projets
                            <br />
                            que j'ai conçus.
                        </h2>
                    </div>

                    <Link
                        to="/projects"
                        className="group flex w-fit items-center gap-4 border-b border-white/20 pb-3 text-sm uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:border-white hover:text-white"
                    >
                        Voir tous les projets

                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
                    </Link>
                </div>

                {loading && (
                    <div className="flex min-h-80 items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-8 animate-spin rounded-full border border-white/20 border-t-white" />

                            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                                Chargement
                            </p>
                        </div>
                    </div>
                )}

                {!loading && featuredProjects.length > 0 && (
                    <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-32">
                        {featuredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}

                {!loading && featuredProjects.length === 0 && (
                    <div className="border-y border-white/10 py-20">
                        <p className="text-xl text-white/30">
                            Aucun projet sélectionné pour le moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}