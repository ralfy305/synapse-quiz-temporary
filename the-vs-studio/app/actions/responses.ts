"use server";

import type {
  ModuleCompletion,
  ResponseAnswer,
} from "@/lib/types";

async function getResponseStore() {
  return import("@/lib/responses");
}

export async function saveModuleResponses(
  moduleId: string,
  responses: Record<string, ResponseAnswer>
): Promise<ModuleCompletion> {
  const store = await getResponseStore();
  return store.saveModuleResponses(moduleId, responses);
}

export async function getAllModuleCompletions(): Promise<ModuleCompletion[]> {
  const store = await getResponseStore();
  return store.getAllModuleCompletions();
}

export async function getModuleHistory(
  moduleId: string
): Promise<ModuleCompletion[]> {
  const store = await getResponseStore();
  return store.getModuleHistory(moduleId);
}
