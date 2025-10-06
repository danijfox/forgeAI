'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating metadata for document chunks.
 *
 * The flow takes a document chunk as input and returns descriptive metadata and tags.
 * This allows users to quickly identify and retrieve specific information from large documents.
 *
 * @exports generateChunkMetadata - The main function to generate chunk metadata.
 * @exports GenerateChunkMetadataInput - The input type for the generateChunkMetadata function.
 * @exports GenerateChunkMetadataOutput - The output type for the generateChunkMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChunkMetadataInputSchema = z.object({
  chunk: z.string().describe('The document chunk to generate metadata for.'),
});
export type GenerateChunkMetadataInput = z.infer<
  typeof GenerateChunkMetadataInputSchema
>;

const GenerateChunkMetadataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document chunk.'),
  tags: z
    .array(z.string())
    .describe('Keywords or tags associated with the document chunk.'),
});

export type GenerateChunkMetadataOutput = z.infer<
  typeof GenerateChunkMetadataOutputSchema
>;

export async function generateChunkMetadata(
  input: GenerateChunkMetadataInput
): Promise<GenerateChunkMetadataOutput> {
  return generateChunkMetadataFlow(input);
}

const generateChunkMetadataPrompt = ai.definePrompt({
  name: 'generateChunkMetadataPrompt',
  input: {schema: GenerateChunkMetadataInputSchema},
  output: {schema: GenerateChunkMetadataOutputSchema},
  prompt: `You are an expert in document understanding and metadata generation.
  Given a document chunk, your task is to generate a concise summary and a set of relevant tags.
  The summary should capture the main idea of the chunk, and the tags should be keywords that can help users quickly identify the content of the chunk.

  Document Chunk: {{{chunk}}}

  Summary:
  Tags:`, // Ensure the LLM returns structured data that matches the schema
});

const generateChunkMetadataFlow = ai.defineFlow(
  {
    name: 'generateChunkMetadataFlow',
    inputSchema: GenerateChunkMetadataInputSchema,
    outputSchema: GenerateChunkMetadataOutputSchema,
  },
  async input => {
    const {output} = await generateChunkMetadataPrompt(input);
    return output!;
  }
);
