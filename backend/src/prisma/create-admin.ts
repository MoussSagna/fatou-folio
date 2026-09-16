import "dotenv/config";

import { db } from "./db";
import { hashPassword } from "../auth/password";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env",
    );
  }

  if (password.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD must contain at least 12 characters",
    );
  }

  const existingUsers = await db.orm.public.User
    .where({ email })
    .all();

  if (existingUsers[0]) {
    throw new Error("An admin with this email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await db.orm.public.User.create({
    email,
    passwordHash,
  });

  console.log(`Admin created: ${user.email}`);
}

createAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });