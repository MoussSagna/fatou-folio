import { useEffect, useState } from "react";
import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import { getExperiences } from "../../services";
import { useProfile } from "../../hooks";
import type { Experience } from "../../types";

export default function ExperienceSection() {
    const { profile } = useProfile();

    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExperiences = async () => {
            try {
                const data = await getExperiences();

                setExperiences(
                    [...data].sort(
                        (a, b) => a.order - b.order,
                    ),
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void loadExperiences();
    }, []);

    return (
        <section className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-16 md:grid-cols-[1fr_3fr]">
                    <Reveal>
                        <div className="flex items-start gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-white" />

                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                {profile?.experienceLabel ||
                                    "Expérience"}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal delay={0.1}>
                            <div className="mb-16 flex items-end justify-between gap-8">
                                <h2 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl lg:text-8xl">
                                    {profile?.experienceHeading ||
                                        "Mon parcours."}
                                </h2>

                                {!loading &&
                                    experiences.length > 0 && (
                                        <span className="hidden pb-2 text-xs uppercase tracking-[0.2em] text-white/30 md:block">
                                            {experiences.length} expériences
                                        </span>
                                    )}
                            </div>
                        </Reveal>

                        {loading && (
                            <div className="border-t border-white/10">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="border-b border-white/10 py-9"
                                    >
                                        <div className="h-7 w-40 animate-pulse rounded bg-white/5" />

                                        <div className="mt-4 h-5 w-64 animate-pulse rounded bg-white/5" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading &&
                            experiences.length > 0 && (
                                <div className="border-t border-white/10">
                                    {experiences.map(
                                        (
                                            experience,
                                            index,
                                        ) => (
                                            <Reveal
                                                key={
                                                    experience.id
                                                }
                                                delay={
                                                    index * 0.05
                                                }
                                            >
                                                <motion.article
                                                    whileHover="hover"
                                                    className="group relative border-b border-white/10 py-8 md:py-10"
                                                >
                                                    <motion.div
                                                        variants={{
                                                            hover: {
                                                                x: 10,
                                                            },
                                                        }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 25,
                                                        }}
                                                        className="grid gap-6 md:grid-cols-[180px_1fr_60px]"
                                                    >
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                                                                {
                                                                    experience.period
                                                                }
                                                            </p>

                                                            {experience.location && (
                                                                <p className="mt-2 text-xs text-white/20">
                                                                    {
                                                                        experience.location
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h3 className="text-2xl font-medium tracking-[-0.03em] transition-colors duration-300 group-hover:text-white md:text-4xl">
                                                                {
                                                                    experience.role
                                                                }
                                                            </h3>

                                                            <p className="mt-2 text-sm text-white/50 md:text-base">
                                                                {
                                                                    experience.company
                                                                }
                                                            </p>

                                                            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/30 transition-colors duration-300 group-hover:text-white/60 md:text-base">
                                                                {
                                                                    experience.description
                                                                }
                                                            </p>
                                                        </div>

                                                        <motion.span
                                                            variants={{
                                                                hover: {
                                                                    x: 5,
                                                                    y: -5,
                                                                    rotate: 5,
                                                                },
                                                            }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 400,
                                                                damping: 15,
                                                            }}
                                                            className="hidden text-xl md:block"
                                                        >
                                                            ↗
                                                        </motion.span>
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{
                                                            scaleX: 0,
                                                        }}
                                                        variants={{
                                                            hover: {
                                                                scaleX: 1,
                                                            },
                                                        }}
                                                        transition={{
                                                            duration: 0.5,
                                                            ease: [
                                                                0.22,
                                                                1,
                                                                0.36,
                                                                1,
                                                            ],
                                                        }}
                                                        className="absolute bottom-0 left-0 h-px w-full origin-left bg-white"
                                                    />
                                                </motion.article>
                                            </Reveal>
                                        ),
                                    )}
                                </div>
                            )}

                        {!loading &&
                            experiences.length === 0 && (
                                <div className="border-y border-white/10 py-12">
                                    <p className="text-sm uppercase tracking-[0.2em] text-white/30">
                                        Aucune expérience renseignée.
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </section>
    );
}