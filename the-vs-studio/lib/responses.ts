/**
 * Response storage backed by Node's built-in SQLite driver.
 * This is the production path for the desktop application.
 */

import { randomUUID } from "node:crypto";

import { getDb } from "./db/client";
import { TABLES } from "./db/schema";
import type {
  ModuleCompletion,
  QuestionResponse,
  ResponseAnswer,
} from "./types";

function getResponsesDb() {
  return getDb();
}

export function saveModuleResponses(
  moduleId: string,
  responses: Record<string, ResponseAnswer>
): ModuleCompletion {
  const timestamp = new Date();

  const formattedResponses: QuestionResponse[] = Object.entries(responses).map(
    ([questionId, answer]) => ({
      questionId,
      answer,
      timestamp: timestamp.toISOString(),
    })
  );

  const completion: ModuleCompletion = {
    moduleId,
    responses: formattedResponses,
    completedAt: timestamp.toISOString(),
  };

  try {
    // Append-only for history: prior runs for this module are preserved by their createdAt batch.
    // Each saveModuleResponses call shares one timestamp across its rows, enabling later grouping by run.
    if (formattedResponses.length === 0) return completion;

    const db = getResponsesDb();
    const insert = db.prepare(`
      INSERT INTO ${TABLES.quizResponses}
        (id, user_id, module_id, question_id, answer, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec("BEGIN IMMEDIATE");
    try {
      for (const response of formattedResponses) {
        insert.run(
          randomUUID(),
          "local-user",
          moduleId,
          response.questionId,
          JSON.stringify(response.answer),
          timestamp.toISOString(),
          timestamp.toISOString()
        );
      }
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Failed to save responses to SQLite:", error);
  }

  return completion;
}

export function getAllModuleCompletions(): ModuleCompletion[] {
  try {
    const allRuns = buildAllHistoricalRuns();
    // Reduce to the most recent run per module (latest-only view for Intake/Airlock compat)
    const latestByModule: Record<string, ModuleCompletion> = {};
    for (const run of allRuns) {
      if (
        !latestByModule[run.moduleId] ||
        run.completedAt > latestByModule[run.moduleId].completedAt
      ) {
        latestByModule[run.moduleId] = run;
      }
    }
    return Object.values(latestByModule);
  } catch (error) {
    console.error("Failed to read responses from SQLite:", error);
    return [];
  }
}

function buildAllHistoricalRuns(): ModuleCompletion[] {
  const db = getResponsesDb();
  const rows = db
    .prepare(`
      SELECT module_id, question_id, answer, created_at
      FROM ${TABLES.quizResponses}
      ORDER BY created_at ASC, rowid ASC
    `)
    .all() as Array<{
      module_id: string;
      question_id: string;
      answer: string;
      created_at: string | number;
    }>;

  // Group by composite batch key: moduleId + createdAt (every saveModuleResponses shares one timestamp for its rows)
  const byBatch: Record<
    string,
    { moduleId: string; responses: QuestionResponse[]; completedAt: string }
  > = {};

  for (const row of rows) {
    const rawTs = row.created_at;
    const moduleId = row.module_id;
    const batchKey = `${moduleId}::${rawTs}`;
    if (!byBatch[batchKey]) {
      const iso =
        typeof rawTs === "number"
          ? new Date(rawTs * 1000).toISOString()
          : new Date(rawTs).toISOString();
      byBatch[batchKey] = {
        moduleId,
        responses: [],
        completedAt: iso,
      };
    }
    byBatch[batchKey].responses.push({
      questionId: row.question_id,
      answer: typeof row.answer === "string" ? JSON.parse(row.answer) : row.answer,
      timestamp:
        typeof rawTs === "number"
          ? new Date(rawTs * 1000).toISOString()
          : new Date(rawTs).toISOString(),
    });
  }

  return Object.values(byBatch).map((b) => ({
    moduleId: b.moduleId,
    responses: b.responses,
    completedAt: b.completedAt,
  }));
}

export function getModuleHistory(moduleId: string): ModuleCompletion[] {
  try {
    return buildAllHistoricalRuns()
      .filter((r) => r.moduleId === moduleId)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  } catch (error) {
    console.error("Failed to read module history from SQLite:", error);
    return [];
  }
}

export function getModuleCompletion(moduleId: string): ModuleCompletion | undefined {
  return getAllModuleCompletions().find((c) => c.moduleId === moduleId);
}

export function hasCompletedModule(moduleId: string): boolean {
  return getAllModuleCompletions().some((c) => c.moduleId === moduleId);
}

export function clearAllResponses(): void {
  try {
    const db = getResponsesDb();
    db.exec(`DELETE FROM ${TABLES.quizResponses}`);
  } catch (error) {
    console.error("Failed to clear responses:", error);
  }
}
