import { motion } from "motion/react";

const AnimatedLoader = () => {
    return(
        <main className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
            <div className="flex flex-col items-center gap-5">
                <motion.div
                    className="h-10 w-10 rounded-full border border-white/20 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <motion.p
                    className="text-xs uppercase tracking-[0.3em] text-white/40"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    Chargement
                </motion.p>
            </div>
        </main>
    )
}

export default AnimatedLoader;
