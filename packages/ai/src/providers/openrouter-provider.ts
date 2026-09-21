import OpenAI from "openai";

import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
} from "./llm-provider.js";

export class OpenRouterProvider implements LLMProvider {
  private readonly client: OpenAI;

  constructor(
    private readonly model: string,
  ) {
    this.client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  async generate(
    request: LLMRequest,
  ): Promise<LLMResponse> {
    const response =
  await this.client.chat.completions.create({
    model: this.model,

    messages: [
      {
        role: "system",
        content: request.systemPrompt,
      },
      {
        role: "user",
        content: request.userPrompt,
      },
    ],

    temperature:
      request.temperature ?? 0.2,

    ...(request.maxTokens !== undefined && {
      max_tokens: request.maxTokens,
    }),
  });

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "LLM returned an empty response",
      );
    }

    return {
      content,
      model: response.model ?? this.model,
      provider: "openrouter",
    };
  }
}