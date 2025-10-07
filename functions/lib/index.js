"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDocumentUploaded = void 0;
const storage_1 = require("firebase-functions/v2/storage");
const storage_2 = require("firebase-admin/storage");
const app_1 = require("firebase-admin/app");
const firebase_functions_1 = require("firebase-functions");
(0, app_1.initializeApp)();
exports.onDocumentUploaded = (0, storage_1.onObjectFinalized)({
    bucket: "studio-774665260-80d2e.appspot.com",
}, async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const bucket = (0, storage_2.getStorage)().bucket(fileBucket);
    const file = bucket.file(filePath);
    try {
        const [content] = await file.download();
        firebase_functions_1.logger.info(`File content: ${content.toString()}`);
    }
    catch (error) {
        firebase_functions_1.logger.error(`Error downloading file: ${error}`);
    }
    return null;
});
//# sourceMappingURL=index.js.map