'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notFound, useParams } from 'next/navigation';
import {
  Upload,
  BrainCircuit,
  MessageSquare,
  Tags,
  FileText,
  Loader2,
  Send,
  Download,
  MoreVertical,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Interfaces matching our Firestore data model
interface CollectionData {
  name: string;
  summary: string;
  userId: string;
}

interface DocumentData {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  downloadUrl: string;
}

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const { id: collectionId } = params;
  const { user } = useAuth();
  const { toast } = useToast();

  const [collectionData, setCollectionData] = useState<CollectionData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to listen for real-time collection data
  useEffect(() => {
    if (!user || !collectionId) return;
    const docRef = doc(db, 'collections', collectionId as string);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as CollectionData;
        if (data.userId === user.uid) {
          setCollectionData(data);
        } else {
          notFound();
        }
      } else {
        notFound();
      }
    });
    return () => unsubscribe();
  }, [collectionId, user]);

  // Effect to listen for real-time documents in the sub-collection
  useEffect(() => {
    if (!collectionId) return;
    const docsQuery = query(
      collection(db, 'collections', collectionId as string, 'documents'),
      orderBy('uploadedAt', 'desc')
    );
    const unsubscribe = onSnapshot(docsQuery, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentData));
      setDocuments(docsData);
    });
    return () => unsubscribe();
  }, [collectionId]);

  // Function to trigger file input
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle file selection and start upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !collectionId) return;

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `users/${user.uid}/${collectionId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        const token = await user.getIdToken();

        // Notify backend to create a Firestore document for the file
        await fetch(`/api/collections/${collectionId}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            downloadUrl: downloadUrl,
          }),
        });

        setUploadProgress(100); 
        setTimeout(() => {
            setIsUploading(false);
            toast({ title: 'Upload complete', description: `${file.name} has been added.` });
        }, 500);
      }
    );
  };

  if (!collectionData) {
    // You can return a loading spinner here
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <>
     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <PageHeader title={collectionData.name} description={collectionData.summary} />
      <Tabs defaultValue="documents" className="mt-6">
        <TabsList>
          <TabsTrigger value="documents"><FileText className="w-4 h-4 mr-2" />Documents</TabsTrigger>
          <TabsTrigger value="metadata"><Tags className="w-4 h-4 mr-2" />Metadata</TabsTrigger>
          <TabsTrigger value="generate"><BrainCircuit className="w-4 h-4 mr-2" />Generate Dataset</TabsTrigger>
          <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" />Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage the documents in this collection. Max 10MB per file.</CardDescription>
            </CardHeader>
            <CardContent>
              {isUploading && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Uploading: {uploadProgress.toFixed(0)}%</p>
                  <Progress value={uploadProgress} />
                </div>
              )}
              <Button onClick={handleUploadButtonClick} disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size (KB)</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell><Badge variant="outline">{doc.type}</Badge></TableCell>
                      <TableCell>{(doc.size / 1024).toFixed(2)}</TableCell>
                      <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs remain unchanged for now */}
        <TabsContent value="metadata">...</TabsContent>
        <TabsContent value="generate">...</TabsContent>
        <TabsContent value="chat">...</TabsContent>
      </Tabs>
    </>
  );
}
