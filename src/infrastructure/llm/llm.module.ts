import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LlmService } from './llm.service';

@Module({
  providers: [
    {
      provide: 'GENAI_CLIENT',
      useFactory: (config: ConfigService) =>
        new GoogleGenerativeAI(config.getOrThrow<string>('GEMINI_API_KEY')),
      inject: [ConfigService],
    },
    LlmService,
  ],
  exports: [LlmService],
})
export class LlmModule {}
