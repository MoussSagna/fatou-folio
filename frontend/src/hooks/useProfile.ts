import { useEffect, useState } from "react";

import { getProfile } from "../services";
import type { Profile } from "../types/";

interface UseProfileResult {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
}

export function useProfile(): UseProfileResult {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();

                setProfile(data);
            } catch (error) {
                console.error(error);
                setError("Unable to fetch profile");
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    return {
        profile,
        loading,
        error,
    };
}