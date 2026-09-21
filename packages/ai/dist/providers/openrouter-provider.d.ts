import type { LLMProvider, LLMRequest, LLMResponse } from "./llm-provider.js";
export declare class OpenRouterProvider implements LLMProvider {
    private readonly model;
    private readonly client;
    constructor(model: string);
    generate(request: LLMRequest): Promise<LLMResponse>;
}
//# sourceMappingURL=openrouter-provider.d.ts.map