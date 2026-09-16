import { motion } from "motion/react";
import { Link } from "react-router-dom";

import type { Project } from "../../types";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({
                                        project,
                                    }: ProjectCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Link to={`/projects/${project.slug}`}>
                <div className="relative overflow-hidden rounded-[2rem] bg-[#222]">
                    <motion.img
                        layoutId={`project-image-${project.id}`}
                        src={project.coverImage}
                        alt={project.title}
                        className="aspect-[4/3] w-full object-cover"
                        whileHover={{
                            scale: 1.06,
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />

                    <motion.div
                        className="absolute inset-0 bg-black/0"
                        whileHover={{
                            backgroundColor: "rgba(0, 0, 0, 0.15)",
                        }}
                        transition={{ duration: 0.5 }}
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        whileHover={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-black"
                    >
                        ↗
                    </motion.div>
                </div>

                <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                        <motion.h3
                            className="text-2xl font-medium tracking-tight"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.3 }}
                        >
                            {project.title}
                        </motion.h3>

                        <p className="mt-2 text-sm text-white/50">
                            {project.category}
                        </p>
                    </div>

                    <motion.span
                        className="text-xl"
                        whileHover={{
                            x: 5,
                            y: -5,
                            rotate: 5,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                        }}
                    >
                        ↗
                    </motion.span>
                </div>
            </Link>
        </motion.article>
    );
}