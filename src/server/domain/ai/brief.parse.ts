import { parseAndValidateAiBriefJson, validateAiBriefOutput } from "@/server/domain/ai/brief.schema";
import type { AiBriefOutput } from "@/server/domain/ai/brief.schema";

function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function extractFirstJsonObject(text: string): string | null {
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      if (start === -1) start = i;
      depth += 1;
      continue;
    }

    if (ch === "}") {
      if (depth > 0) depth -= 1;
      if (depth === 0 && start !== -1) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

export function parseAiBriefFromText(text: string): AiBriefOutput {
  const trimmed = stripCodeFences(text);

  try {
    return parseAndValidateAiBriefJson(trimmed);
  } catch {
    const extracted = extractFirstJsonObject(trimmed);
    if (!extracted) {
      throw new Error("AI_BRIEF_PARSE_FAILED");
    }

    const parsed = JSON.parse(extracted) as unknown;
    return validateAiBriefOutput(parsed);
  }
}
