import { onObjectFinalized } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions";

export const onDocumentUploaded = onObjectFinalized({
    bucket: "studio-774665260-80d2e.appspot.com",
}, (event) => {
    const filePath = event.data.name;

    logger.info(`A new file has been uploaded. Event data: ${JSON.stringify(event)}`);
    logger.info(`Processing file: ${filePath}`);

    // Here you can add your logic to process the file.
    // For example, read the file, process its content, etc.

    return null;
});
