import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { GroundednessResult } from '@/types/beat';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const groundednessPrompt = fs.readFileSync(
  path.join(process.cwd(), 'prompts/groundedness-check.txt'),
  'utf-8'
);

export async function checkGroundedness(
  sourceSnippet: string,
  narration: string
): Promise<GroundednessResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', // cheap model, runs on every beat
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = groundednessPrompt
    .replace('{{source_snippet}}', sourceSnippet)
    .replace('{{narration}}', narration);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text) as GroundednessResult;
}