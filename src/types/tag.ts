export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color?: string; // for visual distinction in UI
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
