import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { useProfile } from "../../hooks";

const navItems = [
  { label: "Projets", href: "/projects" },
  { label: "À propos", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function Navbar() {
  const { profile, loading } = useProfile();
  const initial = profile?.name?.charAt(0) || "F";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 py-6 md:px-12">
      <nav className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between gap-4">
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <Link to="/" className="flex items-center text-2xl font-semibold">
            {loading ? "F." : `${initial}.`}
          </Link>
        </motion.div>

        <div className="hidden flex-row items-center gap-8 md:flex">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
              }}
            >
              <Link
                to={item.href}
                className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.4,
            }}
          >
            <Link
              to="/#contact"
              className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-all duration-300"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                backgroundColor: "transparent",
              }}
            >
              <span>{profile?.heroCtaText || "Me contacter"}</span>
              <span>↗</span>
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
