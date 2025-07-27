export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}

export interface NoteTag {
  id: string;
  name: string;
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
