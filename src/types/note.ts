export interface Note {
  id: string;
  user_id: string;
  title?: string; // optional, inferred from content if missing
  content: YooptaContentValue | string; // Support both for migration
  date: string; // YYYY-MM-DD format
  linkedTaskIds: string[]; // One note can have multiple tasks
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Add Yoopta types
export interface YooptaContentValue {
  [blockId: string]: {
    id: string;
    type: string;
    value: Array<{
      id: string;
      type: string;
      children: Array<{
        text: string;
        [key: string]: any;
      }>;
      props?: Record<string, any>;
    }>;
    meta: {
      order: number;
      depth: number;
    };
  };
} 