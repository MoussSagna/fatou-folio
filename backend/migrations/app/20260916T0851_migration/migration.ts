#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/25984c0dceec801eba726cd3923015ba9d2b14486ec7c6cc350eaf9b64a966b6/contract';
import endContract from '../../snapshots/25984c0dceec801eba726cd3923015ba9d2b14486ec7c6cc350eaf9b64a966b6/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/75a630cf00641d01a2a0c171d3ba91932a8ae0acced6cf9e76611da30ead668c/contract';
import startContract from '../../snapshots/75a630cf00641d01a2a0c171d3ba91932a8ae0acced6cf9e76611da30ead668c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'experience',
        columns: [
          col('company', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('period', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profileId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'profile',
        columns: [
          col('aboutCtaText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('aboutLabel', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('aboutSecondaryText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('behance', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('bio', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('contactAvailabilityText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('contactCtaText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('contactEmail', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('contactHeading', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('contactLabel', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('cvUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('dribbble', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('experienceHeading', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('experienceLabel', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('footerAvailabilityText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('heroAvailabilityText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('heroCtaText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'int4', { notNull: true, default: lit(1), codecRef: { codecId: 'pg/int4@1' } }),
          col('instagram', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('linkedin', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profileImage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profileImagePublicId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('skillsHeading', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('skillsLabel', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'session',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('token', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'skill',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('number', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('profileId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'project',
        column: col('coverPublicId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'projectImage',
        column: col('publicId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'session',
        constraint: 'session_token_key',
        columns: ['token'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'experience',
        index: 'experience_profileId_idx_d9cdfcaf',
        columns: ['profileId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'session',
        index: 'session_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'skill',
        index: 'skill_profileId_idx_d9cdfcaf',
        columns: ['profileId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'experience',
        foreignKey: {
          name: 'experience_profileId_fkey',
          columns: ['profileId'],
          references: { schema: 'public', table: 'profile', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'session',
        foreignKey: {
          name: 'session_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'skill',
        foreignKey: {
          name: 'skill_profileId_fkey',
          columns: ['profileId'],
          references: { schema: 'public', table: 'profile', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
