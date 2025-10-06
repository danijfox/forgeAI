'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate metadata summaries, descriptions, and tags for a document collection.
 *
 * The flow takes a collection name and a list of document IDs as input and returns a metadata object containing a summary, description, and tags.
 *
 * @param {GenerateCollectionMetadataInput} input - The input for the flow, containing the collection name and document IDs.
 * @returns {Promise<GenerateCollectionMetadataOutput>} - A promise that resolves to the generated metadata.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCollectionMetadataInputSchema = z.object({
  collectionName: z.string().describe('The name of the collection.'),
  documentIds: z.array(z.string()).describe('The IDs of the documents in the collection.'),
});
export type GenerateCollectionMetadataInput = z.infer<
  typeof GenerateCollectionMetadataInputSchema
>;

const GenerateCollectionMetadataOutputSchema = z.object({
  summary: z.string().describe('A short summary of the collection.'),
  description: z.string().describe('A detailed description of the collection.'),
  tags: z.array(z.string()).describe('Tags associated with the collection.'),
});
export type GenerateCollectionMetadataOutput = z.infer<
  typeof GenerateCollectionMetadataOutputSchema
>;

export async function generateCollectionMetadata(
  input: GenerateCollectionMetadataInput
): Promise<GenerateCollectionMetadataOutput> {
  return generateCollectionMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCollectionMetadataPrompt',
  input: {
    schema: GenerateCollectionMetadataInputSchema,
  },
  output: {
    schema: GenerateCollectionMetadataOutputSchema,
  },
  prompt: `You are an AI assistant helping users understand document collections.

  Generate a summary, description, and tags for the following collection:

  Collection Name: {{{collectionName}}}
  Document IDs: {{{documentIds}}}

  Summary:
  Description:
  Tags:`, // Handlebars syntax is used here
});

const generateCollectionMetadataFlow = ai.defineFlow(
  {
    name: 'generateCollectionMetadataFlow',
    inputSchema: GenerateCollectionMetadataInputSchema,
    outputSchema: GenerateCollectionMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
