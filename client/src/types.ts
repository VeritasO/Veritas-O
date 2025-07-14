export type ReflectionStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface Reflection {
  id: string;
  authorId: string;
  content: string;
  status: ReflectionStatus;
  createdAt: string; // ISO 8601 date string
  updatedAt?: string;
  griefTier?: number; // 1-5, optional for ritual integration
  // Additional fields as needed for reconciliation, ritual, or agent metadata
}
