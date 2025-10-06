"use client";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { datasets } from "@/lib/data";
import { MoreHorizontal, Download, DatabaseZap } from "lucide-react";
import { createVectorDatabase } from "@/ai/flows/create-vector-database";

export default function DatasetsPage() {

  const handleCreateVectorDB = async (datasetName: string) => {
    // In a real app, you would show a toast or loading state
    console.log(`Creating vector DB for ${datasetName}`);
    try {
        const result = await createVectorDatabase({ dataset: datasetName });
        console.log("Vector DB created:", result.vectorDatabaseId);
        // Show success toast
    } catch(e) {
        console.error("Failed to create vector DB", e);
        // Show error toast
    }
  };


  return (
    <>
      <PageHeader
        title="Datasets"
        description="View and manage your AI-generated datasets."
      />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generated Datasets</CardTitle>
          <CardDescription>
            Download your datasets or use them to create a vector database for RAG applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Source Collection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-medium">{dataset.name}</TableCell>
                  <TableCell>{dataset.sourceCollection}</TableCell>
                  <TableCell>
                    <Badge variant={dataset.status === 'Completed' ? 'default' : 'secondary'} className={dataset.status === 'Completed' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}>
                      {dataset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{dataset.createdAt}</TableCell>
                  <TableCell>{dataset.format}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCreateVectorDB(dataset.name)}>
                          <DatabaseZap className="mr-2 h-4 w-4" />
                          Create Vector DB
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
