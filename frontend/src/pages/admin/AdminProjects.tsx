import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Project } from "../../types/project";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/projects`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Unable to load projects");
            }

            const data = (await response.json()) as Project[];

            setProjects(data);
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible de charger les projets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadProjects();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?",
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Unable to delete project");
            }

            setProjects((current) =>
                current.filter((project) => project.id !== id),
            );
        } catch (requestError) {
            console.error(requestError);
            setError("Impossible de supprimer le projet.");
        }
    };

    return (
        <main className="min-h-screen bg-[#111111] px-6 py-12 text-white md:px-12 md:py-16">
            <div className="mx-auto max-w-[1400px]">
                <header className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <Link
                            to="/admin"
                            className="mb-6 inline-flex text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
                        >
                            ← Dashboard
                        </Link>

                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30">
                            Content management
                        </p>

                        <h1 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                            Projects.
                        </h1>
                    </div>

                    <Link
                        to="/admin/projects/new"
                        className="w-fit rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-80"
                    >
                        + New project
                    </Link>
                </header>

                {loading && (
                    <div className="py-20">
                        <p className="text-white/40">Loading projects...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-3">
                        {projects
                            .sort((a, b) => a.order - b.order)
                            .map((project) => (
                                <article
                                    key={project.id}
                                    className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 md:flex-row md:items-center"
                                >
                                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-white/5 md:w-36">
                                        {project.coverImage && (
                                            <img
                                                src={project.coverImage}
                                                alt={project.title}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="truncate text-xl font-medium">
                                            {project.title}
                                        </h2>

                                        <div className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-[0.15em] text-white/30">
                                            <span>{project.category}</span>
                                            {project.year && <span>{project.year}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                    <span
                        className={`rounded-full px-3 py-1 text-xs ${
                            project.published
                                ? "bg-green-400/10 text-green-300"
                                : "bg-white/5 text-white/30"
                        }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>

                                        {project.featured && (
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                        Featured
                      </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <Link
                                            to={`/admin/projects/${project.id}`}
                                            className="text-xs uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(project.id)}
                                            className="text-xs uppercase tracking-[0.15em] text-red-300/50 transition-colors hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}

                        {projects.length === 0 && (
                            <div className="border-y border-white/10 py-20">
                                <p className="text-xl text-white/30">
                                    No projects yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}