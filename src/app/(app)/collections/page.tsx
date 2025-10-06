"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// A an interface that extends the previous Collection type and adds a userId and createdAt
interface Collection {
    id: string;
    name: string;
    summary: string;
    documentCount: number;
    documents: any[];
    userId?: string;
    createdAt?: string;
}

export default function CollectionsPage() {
  const placeholderImage = PlaceHolderImages.find(
    (img) => img.id === "collection-placeholder"
  );

  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "collections"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collectionsData: Collection[] = [];
      querySnapshot.forEach((doc) => {
        collectionsData.push({ id: doc.id, ...doc.data() } as Collection);
      });
      setCollections(collectionsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateCollection = async () => {
    if (!user) return;

    const token = await user.getIdToken();

    const response = await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newCollectionName,
        description: newCollectionDescription,
      }),
    });

    if (response.ok) {
      // The real-time listener will automatically update the UI
      setNewCollectionName("");
      setNewCollectionDescription("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Collections"
        description="Organize your documents into collections to generate datasets."
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
              <DialogDescription>
                Enter a name and description for your new collection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="My New Collection" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="A brief description of your collection." value={newCollectionDescription} onChange={(e) => setNewCollectionDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCollection}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="flex flex-col">
            <CardHeader>
              {placeholderImage && (
                 <div className="relative h-40 w-full mb-4">
                    <Image
                        src={placeholderImage.imageUrl}
                        alt={collection.name}
                        fill
                        className="rounded-lg object-cover"
                        data-ai-hint={placeholderImage.imageHint}
                    />
                 </div>
              )}
              <CardTitle>{collection.name}</CardTitle>
              <CardDescription>{collection.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="mr-2 h-4 w-4" />
                <span>
                  {collection.documentCount} document
                  {collection.documentCount !== 1 ? "s" : ""}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/collections/${collection.id}`}>
                  View Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
