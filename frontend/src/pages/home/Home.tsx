import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import {
    AboutSection,
    ContactSection,
    ExperienceSection,
    Footer,
    Navbar,
    Reveal,
    SelectedWork,
    SkillsSection,
} from "../../components";
import { getProfile } from "../../services";
import type { Profile } from "../../types/";

export default function Home() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (error) {
                console.error(error);
            }
        };

        void loadProfile();
    }, []);

    return (
        <main className="overflow-hidden bg-[#111111] text-white">
            <Navbar />

            <section className="relative flex min-h-screen items-end px-6 pb-12 pt-32 md:px-12 md:pb-16">
                <div className="mx-auto w-full max-w-[1600px]">
                    <div className="relative">
                        <Reveal>
                            <div className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                                <span className="h-2 w-2 rounded-full bg-white" />

                                <span>
                                    {profile?.title ||
                                        "UI/UX Designer · Product Designer"}
                                </span>
                            </div>
                        </Reveal>

                        <div className="relative">
                            <Reveal delay={0.1}>
                                <h1 className="text-[18vw] font-medium uppercase leading-[0.72] tracking-[-0.09em] md:text-[15vw]">
                                    {profile?.name || "Fatou"}
                                </h1>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <h1 className="relative z-10 ml-[7vw] text-[18vw] font-medium uppercase leading-[0.72] tracking-[-0.09em] md:text-[15vw]">
                                    Designer
                                </h1>
                            </Reveal>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.7,
                                    rotate: -10,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 4,
                                }}
                                transition={{
                                    delay: 0.8,
                                    duration: 0.9,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{
                                    rotate: -3,
                                    scale: 1.05,
                                }}
                                className="absolute right-[4%] top-1/2 z-20 hidden h-36 w-28 -translate-y-1/2 overflow-hidden rounded-full border border-white/10 md:block lg:h-52 lg:w-40"
                            >
                                {profile?.profileImage && (
                                    <img
                                        src={profile.profileImage}
                                        alt={
                                            profile.name ||
                                            "Designer"
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </motion.div>
                        </div>

                        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-end">
                            <Reveal delay={0.3}>
                                <div className="max-w-md">
                                    <p className="text-base leading-relaxed text-white/50 md:text-lg">
                                        {profile?.bio ||
                                            "Je conçois des expériences numériques qui associent clarté, émotion et interactions pertinentes."}
                                    </p>

                                    <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30">
                                        {profile?.location && (
                                            <>
                                                <span>
                                                    {profile.location}
                                                </span>
                                                <span>·</span>
                                            </>
                                        )}

                                        <span>
                                            {profile?.heroAvailabilityText ||
                                                "Disponible pour des projets"}
                                        </span>
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="flex justify-start md:justify-end">
                                    <Link
                                        to="/projects"
                                        className="group flex items-center gap-5"
                                    >
                                        <motion.span
                                            whileHover={{
                                                scale: 1.08,
                                            }}
                                            whileTap={{
                                                scale: 0.95,
                                            }}
                                            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-xl transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black"
                                        >
                                            ↗
                                        </motion.span>

                                        <span className="text-sm uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 group-hover:text-white">
                                            {profile?.heroCtaText ||
                                                "Voir mes projets"}
                                        </span>
                                    </Link>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 1.2,
                        duration: 0.8,
                    }}
                    className="absolute bottom-8 right-6 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30 md:right-12 md:flex"
                >
                    <span>Scroll to explore</span>
                    <span className="text-base">↓</span>
                </motion.div>
            </section>

            <SelectedWork />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <ContactSection />
            <Footer />
        </main>
    );
}