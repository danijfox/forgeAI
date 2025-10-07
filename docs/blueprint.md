
# **App Name**: DataForge AI

## Core Features:

- Document Upload: Upload documents (PDF, TXT, etc.) to create datasets. Maximum file size is 10MB per file.
- Collection Management: Organize documents into collections, which are virtual folders for grouping files together. Each collection is limited to 100 documents.
- AI-Powered Dataset Generation: Generate datasets from document collections using AI to extract relevant information, summarize content, and create structured data.
- Metadata generation tool for collections: AI generates metadata summaries, descriptions, tags etc. for each collection.
- Metadata Generation tool for chunks: After a document is broken into smaller parts (chunks), the AI creates and tags descriptive metadata for each part.
- Dataset Download: Download generated datasets in formats such as CSV and JSON.
- Vector Database Creation: Create vector databases from datasets for RAG (Retrieval-Augmented Generation) applications.
- AI Model Chat: Create different AI models to chat with them about the topics of the collections.
- Login and Registration: Platform will manage login and registration through Google.

## Backend Infrastructure & Data Architecture:

- **Hosting**: The entire application is hosted on **Firebase**, leveraging its integrated platform for web apps.
- **User Authentication**: User accounts, login, and registration are managed by **Firebase Authentication**, providing a secure and easy-to-use system (via Google Sign-In).
- **Structured Data Storage**: **Cloud Firestore** is used as the primary NoSQL database. It stores all structured data, including:
    - User profiles.
    - Collection metadata (name, summary, etc.).
    - Document metadata (name, type, size, and a reference to the file in Cloud Storage).
- **File Storage**: **Cloud Storage for Firebase** is used for storing all user-uploaded files (like PDFs, TXT, etc.). It provides a secure and scalable solution for binary file storage.
- **Vector Data for RAG**: **Vertex AI Vector Search** is the planned solution for storing vector embeddings, which will power the AI-based chat and Retrieval-Augmented Generation (RAG) features.

## Style Guidelines:

- Primary color: Light gray (#E0E0E0) to convey a sense of technology and professionalism.
- Background color: White (#FFFFFF), providing a clean and modern feel.
- Accent color: Dark gray (#424242) to highlight key elements and actions.
- Body and headline font: 'Inter', sans-serif, for a clean and modern look.
- Use a set of simple, consistent, line-based icons to represent different document types, actions, and data categories.
- A clean, card-based layout, to display document collections and dataset information clearly. Utilize white space effectively to avoid clutter.
- Subtle transitions and animations for actions such as uploading documents or generating datasets. The purpose is to provide feedback and enhance user experience.
- Utilize a component library for the front end. Styles should be tokenized for easier customization.

## CI/CD & Deployment:

- **Continuous Integration/Deployment**: The project uses GitHub Actions to automate testing and deployment. The primary workflow deploys the backend to Google App Hosting on every push to the `main` branch.
- **`gcloud` CLI Components**: A key lesson from setting up the deployment is that the base `gcloud` installation provided by `google-github-actions/setup-gcloud` is minimal. Additional functionality must be explicitly enabled by installing components.
    - **Configuration**: The `install_components` parameter in the `setup-gcloud` action must be a comma-separated string of component IDs.
    - **Current Component**:
        - `google-cloud-cli-app-hosting`: Required to deploy to App Hosting.
    - **Potential Future Components**:
        - `google-cloud-cli-ai`: This will likely be necessary if the CI/CD workflow needs to interact with Vertex AI, for instance, to manage Vector Search indexes.
        - **Standard Components**: Services like Firestore and Cloud Storage are typically included in the standard `gcloud` installation. However, if a `gcloud firestore` or `gcloud storage` command fails unexpectedly in the workflow, checking for a missing component should be a primary troubleshooting step.
