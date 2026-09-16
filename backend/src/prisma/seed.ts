import "dotenv/config";

import { db } from "./db";

const projects = [
  {
    title: "SACEM Digital Experience",
    slug: "sacem-digital-experience",
    description:
      "Designing a digital experience for SACEM with a focus on usability, clarity and consistency.",
    client: "SACEM",
    role: "UI/UX Designer",
    year: 2024,
    category: "UI/UX Design",
    coverImage:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=80",
    tools: ["Figma", "Miro", "Photoshop"],
    deliverables: [
      "User research",
      "User flows",
      "Wireframes",
      "UI design",
      "Prototypes",
      "Design system",
      "User testing",
    ],
    published: true,
    featured: true,
    order: 1,
  },
  {
    title: "SonofSneakers",
    slug: "sonofsneakers",
    description:
      "A bold and engaging e-commerce experience designed for a sneaker-focused brand.",
    client: "SonofSneakers",
    role: "Webdesigner",
    year: 2021,
    category: "Web Design",
    coverImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    tools: ["Figma", "Photoshop"],
    deliverables: [
      "Information architecture",
      "Wireframes",
      "UI design",
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
      "A digital platform designed to present the Team Trail Ouzbek association and its activities.",
    client: "Association Team Trail Ouzbek",
    role: "Webdesigner",
    year: 2020,
    category: "Web Design",
    coverImage:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80",
    tools: ["Figma", "Photoshop", "WordPress"],
    deliverables: [
      "Information architecture",
      "Wireframes",
      "UI design",
      "Prototype",
      "Website",
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