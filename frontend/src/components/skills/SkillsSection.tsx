import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import { getSkills } from "../../services";
import { useProfile } from "../../hooks";
import type { Skill } from "../../types/";
import { useEffect, useState } from "react";

export default function SkillsSection() {
    const { profile } = useProfile();

    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSkills = async () => {
            try {
                const data = await getSkills();

                setSkills(
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

        void loadSkills();
    }, []);

    return (
        <section className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-16 md:grid-cols-[1fr_3fr]">
                    <Reveal>
                        <div className="flex items-start gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-white" />

                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                {profile?.skillsLabel ||
                                    "Expertise"}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal delay={0.1}>
                            <div className="mb-16 flex items-end justify-between gap-8">
                                <h2 className="text-5xl font-medium tracking-[-0.05em] md:text-7xl lg:text-8xl">
                                    {profile?.skillsHeading ||
                                        "Ce que je fais."}
                                </h2>

                                {!loading &&
                                    skills.length > 0 && (
                                        <span className="hidden pb-2 text-xs uppercase tracking-[0.2em] text-white/30 md:block">
                                            {skills.length} compétences
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
                                        <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && skills.length > 0 && (
                            <div className="border-t border-white/10">
                                {skills.map((skill, index) => (
                                    <Reveal
                                        key={skill.id}
                                        delay={index * 0.05}
                                    >
                                        <motion.div
                                            whileHover="hover"
                                            className="group relative border-b border-white/10 py-7 md:py-9"
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
                                                className="grid items-center gap-6 md:grid-cols-[80px_1fr_1fr_60px]"
                                            >
                                                <span className="text-xs text-white/30">
                                                    {skill.number}
                                                </span>

                                                <h3 className="text-3xl font-medium tracking-[-0.04em] transition-colors duration-300 group-hover:text-white md:text-5xl">
                                                    {skill.title}
                                                </h3>

                                                <p className="max-w-sm text-sm leading-relaxed text-white/30 transition-colors duration-300 group-hover:text-white/60 md:text-base">
                                                    {skill.description}
                                                </p>

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
                                        </motion.div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {!loading && skills.length === 0 && (
                            <div className="border-y border-white/10 py-12">
                                <p className="text-sm uppercase tracking-[0.2em] text-white/30">
                                    Aucune compétence renseignée.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}