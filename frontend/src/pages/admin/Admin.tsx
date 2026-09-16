import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Admin() {
    const { user, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logout();
        } catch (error) {
            console.error(error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#111111] px-6 py-12 text-white md:px-12 md:py-16">
            <div className="mx-auto max-w-[1400px]">
                <header className="mb-16 flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/30">
                            Administration
                        </p>

                        <h1 className="text-6xl font-medium tracking-[-0.06em] md:text-8xl">
                            Tableau de bord.
                        </h1>

                        {user && (
                            <p className="mt-5 text-sm text-white/40">
                                Connecté avec {user.email}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-fit rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loggingOut
                            ? "Déconnexion..."
                            : "Se déconnecter"}
                    </button>
                </header>

                <section className="grid gap-6 md:grid-cols-2">
                    <Link
                        to="/admin/projects"
                        className="group rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04] md:p-10"
                    >
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">
                                    Contenu
                                </p>

                                <h2 className="text-3xl font-medium tracking-tight">
                                    Projets
                                </h2>

                                <p className="mt-4 max-w-md leading-relaxed text-white/40">
                                    Créer, modifier, publier et gérer les projets du portfolio.
                                </p>
                            </div>

                            <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                ↗
                            </span>
                        </div>
                    </Link>

                    <Link
                        to="/admin/profile"
                        className="group rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04] md:p-10"
                    >
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">
                                    Contenu
                                </p>

                                <h2 className="text-3xl font-medium tracking-tight">
                                    Profil
                                </h2>

                                <p className="mt-4 max-w-md leading-relaxed text-white/40">
                                    Gérer le profil, les compétences, les expériences et les informations de contact.
                                </p>
                            </div>

                            <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                ↗
                            </span>
                        </div>
                    </Link>
                </section>
            </div>
        </main>
    );
}