/**
 * Canonical SQLite table names.
 *
 * Keeping these names centralized prevents query drift without requiring a
 * native database adapter or ORM during the desktop build.
 */
export const TABLES = {
  users: "users",
  couples: "couples",
  quizResponses: "quiz_responses",
  airlockMessages: "airlock_messages",
} as const;
