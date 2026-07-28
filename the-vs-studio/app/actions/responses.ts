"use server";

import {
  clearAllResponses as clearAllResponsesStore,
  getAllModuleCompletions as getAllModuleCompletionsStore,
  getModuleCompletion as getModuleCompletionStore,
  getModuleHistory as getModuleHistoryStore,
  hasCompletedModule as hasCompletedModuleStore,
  saveModuleResponses as saveModuleResponsesStore,
} from "@/lib/responses";
import type { ModuleCompletion } from "@/lib/types";

export async function saveModuleResponses(
  moduleId: string,
  responses: Record<string, unknown>
): Promise<ModuleCompletion> {
  return saveModuleResponsesStore(moduleId, responses);
}

export async function getAllModuleCompletions(): Promise<ModuleCompletion[]> {
  return getAllModuleCompletionsStore();
}

export async function getModuleHistory(
  moduleId: string
): Promise<ModuleCompletion[]> {
  return getModuleHistoryStore(moduleId);
}

export async function getModuleCompletion(
  moduleId: string
): Promise<ModuleCompletion | undefined> {
  return getModuleCompletionStore(moduleId);
}

export async function hasCompletedModule(moduleId: string): Promise<boolean> {
  return hasCompletedModuleStore(moduleId);
}

export async function clearAllResponses(): Promise<void> {
  clearAllResponsesStore();
}
