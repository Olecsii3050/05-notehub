/*export interface Note {
  id: number;
  title: string;
  content: string;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
}

export interface CreateNoteResponse {
  note: Note;
}

export interface DeleteNoteResponse {
  message: string;
}
*/
// note.ts
export interface Note {
  id: number;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}
