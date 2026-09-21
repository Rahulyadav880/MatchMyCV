import OpenAI from "openai";
export class OpenRouterProvider {
    model;
    client;
    constructor(model) {
        this.model = model;
        this.client = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });
    }
    async generate(request) {
        const response = await this.client.chat.completions.create({
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
            temperature: request.temperature ?? 0.2,
            ...(request.maxTokens !== undefined && {
                max_tokens: request.maxTokens,
            }),
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("LLM returned an empty response");
        }
        return {
            content,
            model: response.model ?? this.model,
            provider: "openrouter",
        };
    }
}
//# sourceMappingURL=openrouter-provider.js.map