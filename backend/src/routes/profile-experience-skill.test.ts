import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;
type CollectionName = "profiles" | "experiences" | "skills";

const state = vi.hoisted(() => {
  const collections: Record<CollectionName, Row[]> = {
    profiles: [],
    experiences: [],
    skills: [],
  };

  const nextIds: Record<CollectionName, number> = {
    profiles: 1,
    experiences: 1,
    skills: 1,
  };

  const matches = (row: Row, filters: Row) =>
    Object.entries(filters).every(([key, value]) => row[key] === value);

  const repository = (collectionName: CollectionName) => ({
    all: async () => collections[collectionName],
    where: (filters: Row) => ({
      all: async () => collections[collectionName].filter((row) => matches(row, filters)),
      update: async (values: Row) => {
        collections[collectionName].forEach((row) => {
          if (matches(row, filters)) {
            Object.assign(row, values);
          }
        });
      },
      delete: async () => {
        collections[collectionName] = collections[collectionName].filter(
          (row) => !matches(row, filters),
        );
      },
    }),
    create: async (values: Row) => {
      const id = typeof values.id === "number" ? values.id : nextIds[collectionName]++;
      const row = { ...values, id };
      collections[collectionName].push(row);

      return row;
    },
  });

  return {
    collections,
    reset() {
      collections.profiles = [{ id: 42, name: "Fatou", title: "Designer", bio: "Bio", profileImagePublicId: null }];
      collections.experiences = [];
      collections.skills = [];
      nextIds.profiles = 43;
      nextIds.experiences = 1;
      nextIds.skills = 1;
    },
    db: {
      orm: {
        public: {
          Profile: repository("profiles"),
          Experience: repository("experiences"),
          Skill: repository("skills"),
        },
      },
    },
  };
});

vi.mock("../prisma/db.js", () => ({ db: state.db }));
vi.mock("../middleware/require-auth.js", () => ({
  requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));
vi.mock("../services/cloudinary.service.js", () => ({
  deleteCloudinaryImage: vi.fn(),
}));

const { default: app } = await import("../app.js");

let server: Server;
let baseUrl: string;

const profilePayload = {
  name: "Fatou Fofana",
  title: "Designer UI/UX",
  bio: "Designer numérique",
};

const experiencePayload = {
  period: "2024 — 2026",
  company: "Studio",
  role: "Designer UX/UI",
  location: "Paris",
  description: "Conception d’expériences numériques.",
  order: 1,
};

const skillPayload = {
  number: "01",
  title: "Recherche utilisateur",
  description: "Entretiens et tests.",
  order: 1,
};

async function request(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

beforeAll(async () => {
  server = app.listen(0, "127.0.0.1");

  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}/api`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

beforeEach(() => {
  state.reset();
});

describe("Profile", () => {
  it("retrieves and updates the profile that actually exists", async () => {
    const getResponse = await request("/profile");
    expect(getResponse.status).toBe(200);
    expect((await getResponse.json() as Row).id).toBe(42);

    const updateResponse = await request("/profile", {
      method: "PUT",
      body: JSON.stringify(profilePayload),
    });

    expect(updateResponse.status).toBe(200);
    expect((await updateResponse.json() as Row).id).toBe(42);
    expect(state.collections.profiles[0]).toMatchObject(profilePayload);
  });

  it("returns the existing empty-profile response when no profile exists", async () => {
    state.collections.profiles = [];

    const response = await request("/profile");

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 1, name: "", skills: [] });
  });
});

describe("Experiences", () => {
  it("creates, lists, updates and deletes an experience for the actual profile", async () => {
    const createResponse = await request("/experiences", {
      method: "POST",
      body: JSON.stringify(experiencePayload),
    });
    const created = await createResponse.json() as Row;

    expect(createResponse.status).toBe(201);
    expect(created).toMatchObject({ ...experiencePayload, profileId: 42 });

    const listResponse = await request("/experiences");
    expect(listResponse.status).toBe(200);
    expect(await listResponse.json()).toHaveLength(1);

    const updateResponse = await request(`/experiences/${created.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...experiencePayload, role: "Lead Designer" }),
    });
    expect(updateResponse.status).toBe(200);
    expect(await updateResponse.json()).toMatchObject({ id: created.id, role: "Lead Designer", profileId: 42 });
    expect(state.collections.experiences[0]).toMatchObject({ id: created.id, profileId: 42 });

    const deleteResponse = await request(`/experiences/${created.id}`, { method: "DELETE" });
    expect(deleteResponse.status).toBe(204);
    expect(state.collections.experiences).toHaveLength(0);
  });

  it("returns a conflict instead of attempting an insert with a nonexistent profile", async () => {
    state.collections.profiles = [];

    const response = await request("/experiences", {
      method: "POST",
      body: JSON.stringify(experiencePayload),
    });

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      message: "Le profil doit être créé avant d’ajouter une expérience.",
    });
    expect(state.collections.experiences).toHaveLength(0);
  });
});

describe("Skills", () => {
  it("creates, lists, updates and deletes a skill for the actual profile", async () => {
    const createResponse = await request("/skills", {
      method: "POST",
      body: JSON.stringify(skillPayload),
    });
    const created = await createResponse.json() as Row;

    expect(createResponse.status).toBe(201);
    expect(created).toMatchObject({ ...skillPayload, profileId: 42 });

    const listResponse = await request("/skills");
    expect(listResponse.status).toBe(200);
    expect(await listResponse.json()).toHaveLength(1);

    const updateResponse = await request(`/skills/${created.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...skillPayload, title: "Stratégie UX" }),
    });
    expect(updateResponse.status).toBe(200);
    expect(await updateResponse.json()).toMatchObject({ id: created.id, title: "Stratégie UX", profileId: 42 });
    expect(state.collections.skills[0]).toMatchObject({ id: created.id, profileId: 42 });

    const deleteResponse = await request(`/skills/${created.id}`, { method: "DELETE" });
    expect(deleteResponse.status).toBe(204);
    expect(state.collections.skills).toHaveLength(0);
  });

  it("returns a conflict instead of attempting an insert with a nonexistent profile", async () => {
    state.collections.profiles = [];

    const response = await request("/skills", {
      method: "POST",
      body: JSON.stringify(skillPayload),
    });

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      message: "Le profil doit être créé avant d’ajouter une compétence.",
    });
    expect(state.collections.skills).toHaveLength(0);
  });
});
