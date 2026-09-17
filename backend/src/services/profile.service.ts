import { db } from "../prisma/db.js";

export async function getPortfolioProfile() {
  const profiles = await db.orm.public.Profile.all();

  return profiles[0] ?? null;
}
