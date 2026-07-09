import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  type GenerativeModel,
} from '@google/generative-ai';
import { GenerateDescriptionDto } from './dto/generate-description.dto';

@Injectable()
export class LlmService {
  private readonly model: GenerativeModel;

  constructor(
    @Inject('GENAI_CLIENT')
    private readonly genAI: GoogleGenerativeAI,
    private readonly config: ConfigService,
  ) {
    this.model = this.genAI.getGenerativeModel({
      model: this.config.getOrThrow<string>('GEMINI_MODEL'),
    });
  }

  async *generateDescriptionStream(
    dto: GenerateDescriptionDto,
  ): AsyncGenerator<string> {
    const userContent = dto.context
      ? `${dto.title}\n\nAdditional context: ${dto.context}`
      : dto.title;

    const prompt = `You are a task description assistant. Generate a clear, concise task description based on the title and optional context provided.

IMPORTANT: The description MUST be in the SAME LANGUAGE as the title and context.
If the title is in Russian, respond in Russian. If in English, respond in English. Detect the language automatically.

Title: ${userContent}

Requirements:
- Clearly define the task goal
- Do NOT include the title in the response, only the description
- IMPORTANT: Return ONLY plain text, no markdown, no bullet points, no asterisks, no formatting
- Write in natural language`;

    const result = await this.model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  }
}
