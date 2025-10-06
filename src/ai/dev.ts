import { config } from 'dotenv';
config();

import '@/ai/flows/generate-collection-metadata.ts';
import '@/ai/flows/ai-chat-with-collections.ts';
import '@/ai/flows/generate-chunk-metadata.ts';
import '@/ai/flows/create-vector-database.ts';
import '@/ai/flows/generate-dataset-from-collection.ts';