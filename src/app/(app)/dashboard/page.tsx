"use client";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { collections, datasets } from "@/lib/data";
import {
  Folder,
  FileText,
  Database,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();

  const totalDocuments = collections.reduce(
    (acc, collection) => acc + collection.documentCount,
    0
  );

  const stats = [
    {
      title: "Total Collections",
      value: collections.length,
      icon: Folder,
    },
    {
      title: "Total Documents",
      value: totalDocuments,
      icon: FileText,
    },
    {
      title: "Generated Datasets",
      value: datasets.length,
      icon: Database,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {user?.displayName?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of your workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
           <CardHeader>
             <CardTitle>Get Started</CardTitle>
           </CardHeader>
           <CardContent>
            <p className="text-muted-foreground mb-4">
              Ready to turn your documents into structured data? Start by creating a new collection.
            </p>
            <Button asChild>
              <Link href="/collections">
                Go to Collections <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
           </CardContent>
        </Card>
      </div>
    </>
  );
}
