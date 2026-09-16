import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import { useProfile } from "../../hooks";

export default function AboutSection() {
    const { profile, loading } = useProfile();

    return (
        <section
            id="about"
            className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48"
        >
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-16 md:grid-cols-[1fr_3fr]">
                    <Reveal>
                        <div className="flex items-start gap-3">
                            <span
                                className="mt-1 h-2 w-2 rounded-full"
                                style={{ backgroundColor: "var(--color-primary)" }}
                            />

                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                {loading
                                    ? "À propos de moi"
                                    : profile?.aboutLabel ||
                                    "À propos de moi"}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal delay={0.1}>
                            <h2 className="max-w-6xl text-4xl font-medium leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-8xl">
                                {loading
                                    ? "Chargement..."
                                    : profile?.title ||
                                    "UI/UX Designer"}
                            </h2>
                        </Reveal>

                        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
                            <Reveal delay={0.2}>
                                <p className="text-lg leading-relaxed text-white/50 md:text-xl">
                                    {loading
                                        ? "Chargement..."
                                        : profile?.bio || ""}
                                </p>
                            </Reveal>

                            <Reveal delay={0.3}>
                                <p className="text-lg leading-relaxed text-white/50 md:text-xl">
                                    {profile?.aboutSecondaryText ||
                                        "Je conçois des expériences numériques pensées pour être simples, intuitives et agréables à utiliser."}
                                </p>
                            </Reveal>
                        </div>

                        <Reveal delay={0.4}>
                            <motion.div
                                whileHover={{ x: 8 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                }}
                                className="mt-16 inline-flex items-center gap-4 border-b border-white/20 pb-3"
                            >
                                <span className="text-sm uppercase tracking-[0.2em] text-white/60">
                                    {profile?.aboutCtaText ||
                                        "En savoir plus sur moi"}
                                </span>

                                <span className="text-lg">
                                    ↗
                                </span>
                            </motion.div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}