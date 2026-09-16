import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
    const { user, loading, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
                <div className="h-8 w-8 animate-spin rounded-full border border-white/20 border-t-white" />
            </main>
        );
    }

    if (user) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError(null);

            await login(email, password);

            const from =
                (location.state as { from?: string } | null)?.from ??
                "/admin";

            navigate(from, { replace: true });
        } catch (requestError) {
            console.error(requestError);

            if (
                requestError instanceof Error &&
                requestError.message === "Invalid email or password"
            ) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Une erreur serveur est survenue.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6 text-white">
            <div className="w-full max-w-md">
                <div className="mb-10">
                    <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/30">
                        Admin
                    </p>

                    <h1 className="text-5xl font-medium tracking-[-0.05em]">
                        Salut, toi
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Identifiant
            </span>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            autoComplete="email"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                        />
                    </label>

                    <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Mot de passe
            </span>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition-colors focus:border-white/30"
                        />
                    </label>

                    {error && (
                        <p className="text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </main>
    );
}
