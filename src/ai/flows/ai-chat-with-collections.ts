'use server';

/**
 * @fileOverview An AI chat model for interacting with document collections.
 *
 * - chatWithCollection - A function that handles the chat interaction with a collection.
 * - ChatWithCollectionInput - The input type for the chatWithCollection function.
 * - ChatWithCollectionOutput - The return type for the chatWithCollection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithCollectionInputSchema = z.object({
  collectionDescription: z
    .string()
    .describe('A description of the document collection.'),
  userQuery: z.string().describe('The user query about the collection.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history.'),
});
export type ChatWithCollectionInput = z.infer<typeof ChatWithCollectionInputSchema>;

const ChatWithCollectionOutputSchema = z.object({
  response: z.string().describe('The AI model response to the user query.'),
});
export type ChatWithCollectionOutput = z.infer<typeof ChatWithCollectionOutputSchema>;

export async function chatWithCollection(input: ChatWithCollectionInput): Promise<ChatWithCollectionOutput> {
  return chatWithCollectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithCollectionPrompt',
  input: {schema: ChatWithCollectionInputSchema},
  output: {schema: ChatWithCollectionOutputSchema},
  prompt: `You are an AI model designed to chat with users about document collections. Use the collection description to provide responses to the user's query.

Collection Description: {{{collectionDescription}}}

Chat History:
{{#each chatHistory}}
  {{#ifEquals role "user"}}User: {{content}}{{/ifEquals}}
  {{#ifEquals role "assistant"}}Assistant: {{content}}{{/ifEquals}}
{{/each}}

User Query: {{{userQuery}}}

Response: `,
  templateHelpers: {
    ifEquals: function (arg1: any, arg2: any, options: any) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

const chatWithCollectionFlow = ai.defineFlow(
  {
    name: 'chatWithCollectionFlow',
    inputSchema: ChatWithCollectionInputSchema,
    outputSchema: ChatWithCollectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {response: output!.response};
  }
);
