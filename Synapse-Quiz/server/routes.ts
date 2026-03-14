import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResponseSchema } from "@shared/schema";
import { MODULES } from "../client/src/data/quizData";
import { createDrPonzResponse } from "./drponz";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Replit Auth (MUST be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Quiz Response Routes
  app.post("/api/quiz/response", async (req, res) => {
    try {
      const validatedData = insertQuizResponseSchema.parse(req.body);
      const response = await storage.saveQuizResponse(validatedData);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.get("/api/quiz/responses/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const responses = await storage.getQuizResponses(userId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz responses" });
    }
  });

  // Dashboard analysis endpoint
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const responses = await storage.getQuizResponses(userId);
      
      // Calculate completion status
      const totalQuestions = MODULES.reduce((acc, m) => acc + m.questions.length, 0);
      const completedQuestions = responses.length;
      const completionPercentage = Math.round((completedQuestions / totalQuestions) * 100);
      
      // Group responses by module
      const moduleProgress = MODULES.map(module => {
        const moduleResponses = responses.filter(r => r.moduleId === module.id);
        return {
          moduleId: module.id,
          title: module.title,
          completed: moduleResponses.length,
          total: module.questions.length,
          percentage: Math.round((moduleResponses.length / module.questions.length) * 100)
        };
      });
      
      res.json({
        userId,
        completionPercentage,
        totalResponses: completedQuestions,
        totalQuestions,
        moduleProgress,
        responses
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Couple Routes
  app.post("/api/couples", async (req, res) => {
    try {
      const couple = await storage.createCouple(req.body);
      res.json(couple);
    } catch (error) {
      res.status(400).json({ error: "Failed to create couple" });
    }
  });

  app.get("/api/couples/by-code/:inviteCode", async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const couple = await storage.getCoupleByInviteCode(inviteCode);
      if (!couple) {
        res.status(404).json({ error: "Couple not found" });
        return;
      }
      res.json(couple);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch couple" });
    }
  });

  // Airlock Chat Routes
  app.post("/api/airlock/message", async (req, res) => {
    try {
      const { userId, message, conversationHistory = [] } = req.body;
      
      if (!message || typeof message !== "string" || !userId || typeof userId !== "string") {
        res.status(400).json({ error: "Message and userId are required" });
        return;
      }

      // Sanitize conversation history to prevent prompt injection
      // Only allow "user" and "assistant" roles, filter out any "system" messages
      const sanitizedHistory = Array.isArray(conversationHistory) 
        ? conversationHistory
            .filter((msg: any) => 
              msg && 
              typeof msg === "object" &&
              typeof msg.content === "string" &&
              (msg.role === "user" || msg.role === "assistant")
            )
            .map((msg: any) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content.slice(0, 10000) // Limit message length
            }))
            .slice(-20) // Limit history to last 20 messages
        : [];

      // Get user's quiz responses for context
      const userResponses = await storage.getQuizResponses(userId);
      const userContext = MODULES.map(module => ({
        moduleId: module.id,
        title: module.title,
        responses: userResponses
          .filter(r => r.moduleId === module.id)
          .map(r => ({ questionId: r.questionId, answer: r.answer }))
      })).filter(m => m.responses.length > 0);

      // Get Dr. Ponz response
      const drPonzResponse = await createDrPonzResponse(
        message.slice(0, 5000), // Limit input message length
        sanitizedHistory,
        userContext
      );

      res.json({ 
        response: drPonzResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Airlock error:", error);
      res.status(500).json({ error: "Failed to get response from Dr. Ponz" });
    }
  });

  app.get("/api/airlock/messages/:coupleId", async (req, res) => {
    try {
      const { coupleId } = req.params;
      const messages = await storage.getAirlockMessages(coupleId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  return httpServer;
}
