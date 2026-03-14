import { 
  type User, 
  type InsertUser, 
  type Couple, 
  type InsertCouple,
  type QuizResponse,
  type InsertQuizResponse,
  type AirlockMessage,
  type InsertAirlockMessage,
  users,
  couples,
  quizResponses,
  airlockMessages
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Couple operations
  getCouple(id: string): Promise<Couple | undefined>;
  getCoupleByInviteCode(inviteCode: string): Promise<Couple | undefined>;
  createCouple(couple: InsertCouple): Promise<Couple>;
  updateCouple(id: string, couple: Partial<InsertCouple>): Promise<Couple | undefined>;
  
  // Quiz response operations
  saveQuizResponse(response: InsertQuizResponse): Promise<QuizResponse>;
  getQuizResponses(userId: string): Promise<QuizResponse[]>;
  getQuizResponse(userId: string, moduleId: string, questionId: number): Promise<QuizResponse | undefined>;
  updateQuizResponse(id: string, answer: any): Promise<QuizResponse | undefined>;
  
  // Airlock message operations
  saveAirlockMessage(message: InsertAirlockMessage): Promise<AirlockMessage>;
  getAirlockMessages(coupleId: string, limit?: number): Promise<AirlockMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Couple operations
  async getCouple(id: string): Promise<Couple | undefined> {
    const result = await db.select().from(couples).where(eq(couples.id, id));
    return result[0];
  }

  async getCoupleByInviteCode(inviteCode: string): Promise<Couple | undefined> {
    const result = await db.select().from(couples).where(eq(couples.inviteCode, inviteCode));
    return result[0];
  }

  async createCouple(couple: InsertCouple): Promise<Couple> {
    const result = await db.insert(couples).values(couple).returning();
    return result[0];
  }

  async updateCouple(id: string, couple: Partial<InsertCouple>): Promise<Couple | undefined> {
    const result = await db.update(couples).set(couple).where(eq(couples.id, id)).returning();
    return result[0];
  }

  // Quiz response operations
  async saveQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    // Check if response already exists
    const existing = await this.getQuizResponse(response.userId, response.moduleId, response.questionId);
    
    if (existing) {
      // Update existing response
      const result = await db
        .update(quizResponses)
        .set({ answer: response.answer, updatedAt: new Date() })
        .where(eq(quizResponses.id, existing.id))
        .returning();
      return result[0];
    } else {
      // Create new response
      const result = await db.insert(quizResponses).values(response).returning();
      return result[0];
    }
  }

  async getQuizResponses(userId: string): Promise<QuizResponse[]> {
    return db.select().from(quizResponses).where(eq(quizResponses.userId, userId));
  }

  async getQuizResponse(userId: string, moduleId: string, questionId: number): Promise<QuizResponse | undefined> {
    const result = await db
      .select()
      .from(quizResponses)
      .where(
        and(
          eq(quizResponses.userId, userId),
          eq(quizResponses.moduleId, moduleId),
          eq(quizResponses.questionId, questionId)
        )
      );
    return result[0];
  }

  async updateQuizResponse(id: string, answer: any): Promise<QuizResponse | undefined> {
    const result = await db
      .update(quizResponses)
      .set({ answer, updatedAt: new Date() })
      .where(eq(quizResponses.id, id))
      .returning();
    return result[0];
  }

  // Airlock message operations
  async saveAirlockMessage(message: InsertAirlockMessage): Promise<AirlockMessage> {
    const result = await db.insert(airlockMessages).values(message).returning();
    return result[0];
  }

  async getAirlockMessages(coupleId: string, limit: number = 50): Promise<AirlockMessage[]> {
    return db
      .select()
      .from(airlockMessages)
      .where(eq(airlockMessages.coupleId, coupleId))
      .orderBy(airlockMessages.createdAt)
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
