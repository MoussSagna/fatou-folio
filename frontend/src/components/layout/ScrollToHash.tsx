import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = decodeURIComponent(hash.slice(1));
            const element = document.getElementById(id);

            if (!element) {
                return;
            }

            requestAnimationFrame(() => {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });

            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "auto",
        });
    }, [hash, pathname]);

    return null;
}