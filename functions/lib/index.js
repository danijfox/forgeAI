"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDocumentUploaded = void 0;
const storage_1 = require("firebase-functions/v2/storage");
const firebase_functions_1 = require("firebase-functions");
exports.onDocumentUploaded = (0, storage_1.onObjectFinalized)({
    bucket: "studio-774665260-80d2e.appspot.com",
}, (event) => {
    const filePath = event.data.name;
    firebase_functions_1.logger.info(`A new file has been uploaded. Event data: ${JSON.stringify(event)}`);
    firebase_functions_1.logger.info(`Processing file: ${filePath}`);
    // Here you can add your logic to process the file.
    // For example, read the file, process its content, etc.
    return null;
});
//# sourceMappingURL=index.js.map