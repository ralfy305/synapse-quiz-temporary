/**
 * Response Storage backed by SQLite (via Drizzle).
 * This is the production path for the desktop application.
 */

import { getDb } from "./db/client";
import { quizResponses } from "./db/schema";
import type { ModuleCompletion, QuestionResponse } from "./types";

function getResponsesDb() {
  return getDb();
}

export function saveModuleResponses(
  moduleId: string,
  responses: Record<string, any>
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
    const values = formattedResponses.map((r) => ({
      id: crypto.randomUUID(),
      moduleId,
      userId: "local-user",
      questionId: r.questionId,
      answer: JSON.stringify(r.answer),
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    if (values.length > 0) {
      const db = getResponsesDb();
      db.insert(quizResponses).values(values).run();
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
  const rows = db.select().from(quizResponses).all() as any[];

  // Group by composite batch key: moduleId + createdAt (every saveModuleResponses shares one timestamp for its rows)
  const byBatch: Record<
    string,
    { moduleId: string; responses: QuestionResponse[]; completedAt: string }
  > = {};

  for (const row of rows) {
    const rawTs = row.createdAt;
    const batchKey = `${row.moduleId}::${rawTs}`;
    if (!byBatch[batchKey]) {
      const iso =
        typeof rawTs === "number"
          ? new Date(rawTs * 1000).toISOString()
          : new Date(rawTs).toISOString();
      byBatch[batchKey] = {
        moduleId: row.moduleId,
        responses: [],
        completedAt: iso,
      };
    }
    byBatch[batchKey].responses.push({
      questionId: row.questionId,
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
    db.delete(quizResponses).run();
  } catch (error) {
    console.error("Failed to clear responses:", error);
  }
}
