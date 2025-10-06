'use server';

/**
 * @fileOverview Generates a dataset from a collection of documents using AI.
 *
 * - generateDatasetFromCollection - A function that generates a dataset from a document collection.
 * - GenerateDatasetFromCollectionInput - The input type for the generateDatasetFromCollection function.
 * - GenerateDatasetFromCollectionOutput - The return type for the generateDatasetFromCollection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDatasetFromCollectionInputSchema = z.object({
  collectionName: z.string().describe('The name of the collection to generate the dataset from.'),
  documentTexts: z.array(z.string()).describe('The texts of the documents in the collection.'),
});
export type GenerateDatasetFromCollectionInput = z.infer<typeof GenerateDatasetFromCollectionInputSchema>;

const GenerateDatasetFromCollectionOutputSchema = z.object({
  dataset: z.string().describe('The generated dataset in CSV or JSON format.'),
});
export type GenerateDatasetFromCollectionOutput = z.infer<typeof GenerateDatasetFromCollectionOutputSchema>;

export async function generateDatasetFromCollection(input: GenerateDatasetFromCollectionInput): Promise<GenerateDatasetFromCollectionOutput> {
  return generateDatasetFromCollectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDatasetFromCollectionPrompt',
  input: {schema: GenerateDatasetFromCollectionInputSchema},
  output: {schema: GenerateDatasetFromCollectionOutputSchema},
  prompt: `You are an AI assistant that generates datasets from a collection of documents.\n  The user will provide a collection name and the texts of the documents in the collection.\n  You should extract relevant information, summarize content, and create structured data in CSV or JSON format.\n\n  Collection Name: {{{collectionName}}}\n  Documents: {{{documentTexts}}}\n\n  Generated Dataset:`,
});

const generateDatasetFromCollectionFlow = ai.defineFlow(
  {
    name: 'generateDatasetFromCollectionFlow',
    inputSchema: GenerateDatasetFromCollectionInputSchema,
    outputSchema: GenerateDatasetFromCollectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
