import { onObjectFinalized } from "firebase-functions/v2/storage";
import { getStorage } from "firebase-admin/storage";
import { initializeApp } from "firebase-admin/app";
import { logger } from "firebase-functions";

initializeApp();

export const onDocumentUploaded = onObjectFinalized({
    bucket: "studio-774665260-80d2e.appspot.com",
}, async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const bucket = getStorage().bucket(fileBucket);
    const file = bucket.file(filePath);

    try {
        const [content] = await file.download();
        logger.info(`File content: ${content.toString()}`)
    } catch (error) {
        logger.error(`Error downloading file: ${error}`);
    }

    return null;
});
