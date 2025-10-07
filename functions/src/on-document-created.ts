import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import pdf from "pdf-parse";
import { generate } from "@genkit-ai/ai";
import { geminiPro } from "@genkit-ai/vertexai";

// Ensure Firebase is initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Simple chunking function
function chunkText(text: string, chunkSize = 1500, overlap = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.slice(i, end));
    i += chunkSize - overlap;
    if (i + chunkSize > text.length && i < text.length) {
        chunks.push(text.slice(i));
        break;
    }
  }
  return chunks;
}

export const onDocumentCreated = onDocumentCreated(
  "collections/{collectionId}/documents/{documentId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.info("No data associated with the event");
      return;
    }

    const documentData = snapshot.data();
    const { name, downloadUrl, type, userId } = documentData;

    // Only process PDF files for now
    if (type !== 'application/pdf') {
      logger.info(`Skipping non-PDF file: ${name}`);
      await snapshot.ref.update({ status: 'unsupported' });
      return;
    }

    logger.info(`Processing new PDF document: ${name}`);

    try {
      await snapshot.ref.update({ status: 'processing' });

      // Download the file from Cloud Storage
      const bucket = getStorage().bucket();
      const file = bucket.file(`users/${userId}/${event.params.collectionId}/${name}`);
      const [fileBuffer] = await file.download();

      // Extract text using pdf-parse
      const pdfData = await pdf(fileBuffer);
      const textContent = pdfData.text;

      // Break text into chunks
      const textChunks = chunkText(textContent);

      logger.info(`Document ${name} broken into ${textChunks.length} chunks. Generating metadata...`);

      // Generate metadata for each chunk
      const chunkPromises = textChunks.map(async (chunkText, index) => {
        const llmResponse = await generate({
          model: geminiPro,
          prompt: `Generate a short, descriptive summary and 3-5 relevant tags for the following document chunk. The output must be a valid JSON object with "summary" and "tags" keys.\n\nCHUNK: "${chunkText}" `,
        });

        const metadataText = llmResponse.text();
        const metadataJson = JSON.parse(metadataText);

        // Save metadata to a subcollection
        return snapshot.ref.collection('chunks').add({
          chunkIndex: index,
          text: chunkText,
          summary: metadataJson.summary,
          tags: metadataJson.tags,
          createdAt: new Date().toISOString(),
        });
      });

      await Promise.all(chunkPromises);

      // Update document status to 'processed'
      await snapshot.ref.update({ status: 'processed', chunkCount: textChunks.length });

      logger.info(`Successfully generated metadata for all chunks of document: ${name}`);

    } catch (error) {
      logger.error(`Error processing document ${name}:`, error);
      await snapshot.ref.update({ status: 'error' });
    }
  }
);
