import { z } from "zod";

export const aiBriefSchema = z
  .object({
    outreachMessage: z.string().min(1),
    contentIdeas: z.array(z.string().min(1)).length(5),
    hookSuggestions: z.array(z.string().min(1)).length(3)
  })
  .strict();

export type AiBriefOutput = z.infer<typeof aiBriefSchema>;

export function validateAiBriefOutput(input: unknown): AiBriefOutput {
  return aiBriefSchema.parse(input);
}

export function parseAndValidateAiBriefJson(jsonText: string): AiBriefOutput {
  const parsed = JSON.parse(jsonText);
  return validateAiBriefOutput(parsed);
}
