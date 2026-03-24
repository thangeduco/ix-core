export type NotificationType = "push" | "email" | "in_app";
export type FileType = "image" | "pdf" | "doc" | "other";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}

export interface FileResource {
  id: string;
  url: string;
  file_name: string;
  file_type: FileType;
  uploaded_by: string;
  created_at: Date;
}