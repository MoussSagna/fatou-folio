import { motion } from "motion/react";

import Reveal from "../animations/Reveal";
import { useProfile } from "../../hooks";

export default function ContactSection() {
    const { profile, loading } = useProfile();

    const contactEmail = profile?.contactEmail;

    const contactHeading =
        profile?.contactHeading ||
        "Créons\nquelque chose\nde grand.";

    const contactHeadingLines =
        contactHeading.split("\n");

    return (
        <section
            id="contact"
            className="border-t border-white/10 px-6 py-32 md:px-12 md:py-48"
        >
            <div className="mx-auto max-w-[1600px]">
                <Reveal>
                    <div className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-white" />

                        <p className="text-xs uppercase tracking-[0.3em] text-white/40 md:text-sm">
                            {loading
                                ? "Contact"
                                : profile?.contactLabel ||
                                "Contact"}
                        </p>
                    </div>
                </Reveal>

                <div className="mt-16 grid gap-16 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <Reveal delay={0.1}>
                            <h2 className="max-w-6xl text-6xl font-medium leading-[0.82] tracking-[-0.07em] md:text-8xl lg:text-[10rem]">
                                {contactHeadingLines.map(
                                    (line, index) => (
                                        <span
                                            key={`${line}-${index}`}
                                            className="block"
                                        >
                                            {line}
                                        </span>
                                    ),
                                )}
                            </h2>
                        </Reveal>
                    </div>

                    <Reveal delay={0.2}>
                        <motion.a
                            href={
                                contactEmail
                                    ? `mailto:${contactEmail}`
                                    : undefined
                            }
                            whileHover={{
                                scale: 1.08,
                                rotate: -4,
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 20,
                            }}
                            className="group flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-white text-center text-sm font-medium uppercase tracking-[0.1em] text-black md:h-48 md:w-48"
                        >
                            <span>
                                {profile?.contactCtaText ||
                                    "Démarrer une conversation"}

                                <br />

                                <span className="text-lg">
                                    ↗
                                </span>
                            </span>
                        </motion.a>
                    </Reveal>
                </div>

                <Reveal delay={0.3}>
                    <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-6 md:mt-32 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-white/40">
                            {profile?.contactAvailabilityText ||
                                "Disponible pour des projets freelance et des collaborations sélectionnées"}
                        </p>

                        {contactEmail && (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                            >
                                {contactEmail}
                            </a>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}