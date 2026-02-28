const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export type OpenAiChatParams = {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
};

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function createChatCompletion(params: OpenAiChatParams): Promise<string> {
  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`
    },
    body: JSON.stringify({
      model: params.model,
      temperature: params.temperature ?? 0.2,
      messages: [
        { role: "system", content: params.systemPrompt },
        { role: "user", content: params.userPrompt }
      ]
    })
  });

  const json = (await response.json()) as OpenAiChatResponse;

  if (!response.ok) {
    throw new Error(`OPENAI_CALL_FAILED:${json.error?.message ?? response.statusText}`);
  }

  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OPENAI_EMPTY_RESPONSE");
  }

  return content;
}
