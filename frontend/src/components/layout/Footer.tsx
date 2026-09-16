import { motion } from "motion/react";

import { useProfile } from "../../hooks";

export default function Footer() {
    const { profile, loading } = useProfile();

    const socialLinks = [
        {
            label: "Instagram",
            href: profile?.instagram,
        },
        {
            label: "LinkedIn",
            href: profile?.linkedin,
        },
        {
            label: "Behance",
            href: profile?.behance,
        },
        {
            label: "Dribbble",
            href: profile?.dribbble,
        },
    ].filter(
        (
            social,
        ): social is {
            label: string;
            href: string;
        } => Boolean(social.href),
    );

    return (
        <footer className="border-t border-white/10 px-6 py-8 md:px-12">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-2xl font-medium tracking-[-0.04em]">
                        {loading
                            ? "F."
                            : profile?.name?.charAt(0) ||
                            "F."}
                    </p>

                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
                        {loading
                            ? "Designer UI/UX"
                            : profile?.title ||
                            "Designer UI/UX"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    {socialLinks.map((social) => (
                        <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ y: -3 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                            }}
                            className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                        >
                            {social.label}
                        </motion.a>
                    ))}
                </div>

                <div className="text-xs uppercase tracking-[0.15em] text-white/20">
                    <p>
                        {profile?.footerAvailabilityText ||
                            "Disponible pour des collaborations"}
                    </p>

                    <p className="mt-2">
                        © {new Date().getFullYear()}{" "}
                        {loading
                            ? "Fatou"
                            : profile?.name || "Fatou"}
                    </p>
                </div>
            </div>
        </footer>
    );
}