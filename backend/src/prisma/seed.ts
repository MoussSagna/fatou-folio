import "dotenv/config";

import { db } from "./db";

const projects = [
  {
    title: "SACEM Digital Experience",
    slug: "sacem-digital-experience",
    description:
      "Conception d’une expérience numérique pour la SACEM, axée sur l’ergonomie, la clarté et la cohérence.",
    client: "SACEM",
    role: "UI/UX Designer",
    year: 2024,
    category: "UI/UX Design",
    coverImage:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=80",
    tools: ["Figma", "Miro", "Photoshop"],
    deliverables: [
      "Recherche utilisateur",
      "Parcours utilisateur",
      "Wireframes",
      "Conception d’interface",
      "Prototypes",
      "Système de design",
      "Tests utilisateurs",
    ],
    published: true,
    featured: true,
    order: 1,
  },
  {
    title: "SonofSneakers",
    slug: "sonofsneakers",
    description:
      "Une expérience e-commerce audacieuse et engageante conçue pour une marque spécialisée dans les sneakers.",
    client: "SonofSneakers",
    role: "Webdesigner",
    year: 2021,
    category: "Conception web",
    coverImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    tools: ["Figma", "Photoshop"],
    deliverables: [
      "Architecture de l’information",
      "Wireframes",
      "Conception d’interface",
      "Prototype",
    ],
    published: true,
    featured: true,
    order: 2,
  },
  {
    title: "Team Trail Ouzbek",
    slug: "team-trail-ouzbek",
    description:
      "Une plateforme numérique conçue pour présenter l’association Team Trail Ouzbek et ses activités.",
    client: "Association Team Trail Ouzbek",
    role: "Webdesigner",
    year: 2020,
    category: "Conception web",
    coverImage:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80",
    tools: ["Figma", "Photoshop", "WordPress"],
    deliverables: [
      "Architecture de l’information",
      "Wireframes",
      "Conception d’interface",
      "Prototype",
      "Site web",
      "SEO",
    ],
    published: true,
    featured: false,
    order: 3,
  },
];

async function seed() {
  for (const project of projects) {
    await db.orm.public.Project.create(project);
  }

  console.log(`${projects.length} projects seeded successfully.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
