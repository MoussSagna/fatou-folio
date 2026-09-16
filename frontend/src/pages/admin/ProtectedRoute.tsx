import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border border-white/20 border-t-white" />

                    <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                        Loading
                    </p>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}