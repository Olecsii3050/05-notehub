import axios from "axios";
import type {
  Note,
  FetchNotesResponse,
  CreateNoteResponse,
  DeleteNoteResponse,
} from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number,
  searchTerm: string
): Promise<FetchNotesResponse> => {
  const response = await axiosInstance.get("", {
    params: {
      page,
      search: searchTerm,
    },
  });
  return response.data;
};

export const createNote = async (
  noteData: Omit<Note, "id">
): Promise<CreateNoteResponse> => {
  const response = await axiosInstance.post("", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};
