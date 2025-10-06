export type Document = {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: 'PDF' | 'TXT';
};

export type Collection = {
  id: string;
  name: string;
  summary: string;
  documentCount: number;
  documents: Document[];
};

export type Dataset = {
  id: string;
  name:string;
  sourceCollection: string;
  createdAt: string;
  format: 'CSV' | 'JSON';
  status: 'Completed' | 'Processing';
};

export const collections: Collection[] = [
  {
    id: 'annual-reports-2023',
    name: 'Annual Reports 2023',
    summary: 'A collection of all company annual reports from the fiscal year 2023.',
    documentCount: 2,
    documents: [
      { id: 'doc-1', name: 'Q1_Report_2023.pdf', size: '2.5MB', uploadedAt: '2024-03-15', type: 'PDF' },
      { id: 'doc-2', name: 'Q2_Report_2023.pdf', size: '3.1MB', uploadedAt: '2024-06-20', type: 'PDF' },
    ],
  },
  {
    id: 'market-research-ai',
    name: 'Market Research - AI',
    summary: 'Research papers and articles on the state of AI market trends.',
    documentCount: 3,
    documents: [
       { id: 'doc-3', name: 'AI_Trends_2024.pdf', size: '5.2MB', uploadedAt: '2024-07-01', type: 'PDF' },
       { id: 'doc-4', name: 'Competitor_Analysis.txt', size: '150KB', uploadedAt: '2024-07-05', type: 'TXT' },
       { id: 'doc-5', name: 'LLM_Adoption_Rates.pdf', size: '1.8MB', uploadedAt: '2024-07-10', type: 'PDF' },
    ],
  },
  {
    id: 'project-phoenix-docs',
    name: 'Project Phoenix Docs',
    summary: 'Internal design and specification documents for Project Phoenix.',
    documentCount: 1,
    documents: [
        { id: 'doc-6', name: 'Technical_Spec_v1.2.pdf', size: '850KB', uploadedAt: '2024-05-30', type: 'PDF' },
    ],
  },
];

export const datasets: Dataset[] = [
    { id: 'dataset-1', name: '2023_Financial_Summary', sourceCollection: 'Annual Reports 2023', createdAt: '2024-07-18', format: 'CSV', status: 'Completed' },
    { id: 'dataset-2', name: 'AI_Market_Keywords', sourceCollection: 'Market Research - AI', createdAt: '2024-07-19', format: 'JSON', status: 'Completed' },
    { id: 'dataset-3', name: 'Competitor_Feature_Matrix', sourceCollection: 'Market Research - AI', createdAt: '2024-07-20', format: 'CSV', status: 'Processing' },
];
