import "dotenv/config";

import { db } from "./db";

async function checkAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!email) {
    throw new Error("ADMIN_EMAIL is missing from .env");
  }

  const users = await db.orm.public.User
    .where({ email })
    .all();

  if (!users[0]) {
    console.log("❌ Aucun utilisateur trouvé avec cet email.");
    return;
  }

  console.log("✅ Utilisateur trouvé.");
  console.log(`Email en base : ${users[0].email}`);
  console.log(`ID : ${users[0].id}`);
  console.log(
    `Password hash présent : ${Boolean(users[0].passwordHash)}`,
  );
}

checkAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });