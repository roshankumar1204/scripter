import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { GeneratedBeat } from '@/types/beat';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateBeatPrompt = fs.readFileSync(
  path.join(process.cwd(), 'prompts/generate-beat.txt'),
  'utf-8'
);

export async function generateBeat(sourceText: string): Promise<GeneratedBeat> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = generateBeatPrompt.replace('{{source_text}}', sourceText);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text) as GeneratedBeat;
}